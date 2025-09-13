import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { IBootstrap } from './IBootstrap'
import type { IAppConfig, ICorsConfig, IHelmetConfig, IJwtConfig, ISwaggerConfig } from '@/configs'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { APP_PID } from '@/common/constants'
import { APP_CONFIG_KEY, CORS_CONFIG_KEY, HELMET_CONFIG_KEY, JWT_CONFIG_KEY, SWAGGER_CONFIG_KEY } from '@/configs'
import { LOGGER2_SERVICE_TOKEN } from '@/infrastructure/logger2/logger2.constant'
import { WinstonLogger } from '@/infrastructure/logger2/logger2.util'

/** 热更新模块 */
declare const module: any

/** 应用引导类 */
export class Bootstrap implements IBootstrap {
  /** 日志服务 */
  protected logger: WinstonLogger
  /** 应用配置 */
  protected appConfig: IAppConfig
  /** cors配置 */
  protected corsConfig: ICorsConfig
  /** helmet配置 */
  protected helmetConfig: IHelmetConfig
  /** swagger配置 */
  protected swaggerConfig: ISwaggerConfig
  /** JWT配置 */
  protected jwtConfig: IJwtConfig
  /** 应用实例 */
  protected app: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>
  /** 应用引导实例 */
  public static instance: Bootstrap
  private constructor() {}

  /**
   * 创建实例或获取实例
   * @param rootModule 根模块
   */
  public static async create(rootModule?: any) {
    if (!Bootstrap.instance && !rootModule) throw new Error('There is no application instance, please provide the root module')
    if (!Bootstrap.instance) {
      const logger = new WinstonLogger()
      Bootstrap.instance = new Bootstrap()
      Bootstrap.instance.logger = logger
      Bootstrap.instance.app = await NestFactory.create<NestExpressApplication>(rootModule, {
        logger,
      })
    }
    return Bootstrap.instance
  }

  async initConfig(): Promise<void> {
    this.logger.log('Config 初始化中...', Bootstrap.name)
    const configService = this.app.get(ConfigService)
    this.appConfig = configService.get<IAppConfig>(APP_CONFIG_KEY)!
    this.corsConfig = configService.get<ICorsConfig>(CORS_CONFIG_KEY)!
    this.helmetConfig = configService.get<IHelmetConfig>(HELMET_CONFIG_KEY)!
    this.swaggerConfig = configService.get<ISwaggerConfig>(SWAGGER_CONFIG_KEY)!
    this.jwtConfig = configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    this.logger.log('Config 初始化成功', Bootstrap.name)
    // ...各种配置
  }

  async initMiddlewares(): Promise<void> {
    await this.checkInitConfig()
    this.logger.log('Middlewares 初始化中...', Bootstrap.name)

    // 跨域处理
    const corsConfig = this.corsConfig!
    if (corsConfig.enabled) this.app.enableCors(corsConfig.config)
    // 开启cookie解析
    this.app.use(cookieParser())
    // csrf防御
    // const { doubleCsrfProtection } = doubleCsrf({
    //   getSecret: () => sha256(`${name}-${hostname}-${port}`, wordArray(uuid_v4())),
    //   getSessionIdentifier: (req: Request) => {
    //     const authHeader = req.headers.authorization
    //     if (!authHeader || !authHeader.startsWith('Bearer ')) return ''
    //     const token = authHeader.split(' ')[1]
    //     try {
    //       const jwt = this.app.get<JwtService>(JwtService)
    //       const decoded = jwt.verify(token, {
    //         secret: this.jwtConfig.serviceConfig.secret,
    //       })
    //       console.warn(decoded)
    //       return ''
    //     } catch (error) {
    //       this.logger.warn(error.message, Bootstrap.name)
    //       return ''
    //     }
    //   },
    //   cookieName: 'X-CSRF-Token',
    //   cookieOptions: {
    //     httpOnly: true,
    //     sameSite: 'lax',
    //     secure: false,
    //   },
    //   size: 64,
    // })
    // this.app.use(doubleCsrfProtection)
    // web安全，常见漏洞
    // https://docs.nestjs.com/security/helmet
    const helmetConfig = this.helmetConfig!
    if (helmetConfig.enabled) this.app.use(helmet(helmetConfig.config))

    this.logger.log('Middlewares 初始化成功', Bootstrap.name)
  }

  async checkInitConfig() {
    if (!this.appConfig) {
      await this.app.close()
      throw new Error('Config 未初始化')
    }
  }

  async initPipes(): Promise<void> {
    await this.checkInitConfig()
    this.logger.log('Pipes 初始化中...', Bootstrap.name)
    // 添加全局管道验证
    this.app.useGlobalPipes(
      new ValidationPipe({
        // 配合 @Allow 装饰器添加到白名单
        whitelist: true,
        // 自动类型转换
        transform: true,
        // 白名单里面没有的属性会报错
        forbidNonWhitelisted: true,
      }),
    )
    this.logger.log('Pipes 初始化成功', Bootstrap.name)
  }

  async initGlobalSettings(): Promise<void> {
    await this.checkInitConfig()
    this.logger.log('GlobalSettings 初始化中...', Bootstrap.name)
    // 日志替换
    this.app.useLogger(this.app.get<WinstonLogger>(LOGGER2_SERVICE_TOKEN))

    // 应用关闭钩子
    this.app.enableShutdownHooks()

    // 信任代理设置(用于节流器)
    this.app.set('trust proxy', 'loopback')

    // 设置全局前缀
    this.app.setGlobalPrefix(this.appConfig.globalPrefix)
    this.logger.log('GlobalSettings 初始化成功', Bootstrap.name)
  }

  async initSwagger(): Promise<void> {
    await this.checkInitConfig()
    const swaggerConfig = this.swaggerConfig!
    if (!swaggerConfig.enabled) return
    this.logger.log('Swagger 初始化中...', Bootstrap.name)
    const { title, description, version, ignoreGlobalPrefix, path } = swaggerConfig.config
    const documentBuilder = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: '在请求头Authorization中携带JWT，格式: Bearer <JWT_TOKEN>',
      })
      .build()
    const swaggerDocument = SwaggerModule.createDocument(this.app, documentBuilder, {
      ignoreGlobalPrefix,
    })
    SwaggerModule.setup(path, this.app, swaggerDocument, {
      customSiteTitle: title,
    })
    this.logger.log('Swagger 初始化成功', Bootstrap.name)
  }

  async listen(): Promise<void> {
    await this.checkInitConfig()
    const { name, hostname, port, globalPrefix } = this.appConfig!
    await this.app.listen(port, hostname, async () => {
      const url = await this.app.getUrl()
      this.logger.log(`${name} 开启 port:${port}`, Bootstrap.name)
      this.logger.log(`${name} 开启 pid:${APP_PID}`, Bootstrap.name)
      this.logger.log(`${name} 运行在 ${url}${globalPrefix ? `/${globalPrefix}` : ''}`, Bootstrap.name)
      const swaggerConfig = this.swaggerConfig?.config
      this.logger.log(`Swagger 运行在 ${url}/${swaggerConfig.path}`, Bootstrap.name)
      this.logger.log(`Swagger-json 运行在 ${url}/${swaggerConfig.path}-json`, Bootstrap.name)
      this.logger.log(`Swagger-yaml 运行在 ${url}/${swaggerConfig.path}-yaml`, Bootstrap.name)
    })
  }

  enableHotReload() {
    if (module.hot) {
      module.hot.accept()
      module.hot.dispose(() => {
        this.app.close()
      })
    }
  }
}
