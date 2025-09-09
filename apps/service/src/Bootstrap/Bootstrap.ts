import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { IBootstrap } from './IBootstrap'
import type { IAppConfig, ICorsConfig, IJwtConfig, ISwaggerConfig } from '@/configs'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { APP_PID } from '@/common/constants'
import { APP_CONFIG_KEY, CORS_CONFIG_KEY, JWT_CONFIG_KEY, SWAGGER_CONFIG_KEY } from '@/configs'
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
    this.logger.info('Initializing config...', Bootstrap.name)
    const configService = this.app.get(ConfigService)
    this.appConfig = configService.get<IAppConfig>(APP_CONFIG_KEY)!
    this.corsConfig = configService.get<ICorsConfig>(CORS_CONFIG_KEY)!
    this.swaggerConfig = configService.get<ISwaggerConfig>(SWAGGER_CONFIG_KEY)!
    this.jwtConfig = configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    this.logger.info('Config initialized successfully', Bootstrap.name)
    // ...各种配置
  }

  async initMiddlewares(): Promise<void> {
    await this.checkInitConfig()
    this.logger.info('Initializing middlewares...', Bootstrap.name)
    const cors = this.corsConfig!
    // 跨域处理
    this.app.enableCors({
      // 允许跨域的源
      origin: (origin, callback) => {
        const allowedOrigins = cors.origins.split(',')
        const isLocalNetwork = /^http:\/\/192\.168\.0\.\d{1,3}(?::\d+)?$/.test(origin)
        const isAllowed = allowedOrigins.includes(origin) || isLocalNetwork
        callback(null, isAllowed)
      },
      //  允许跨域的请求方法类型
      methods: cors.methods,
      // 允许跨域的请求头属性
      allowedHeaders: cors.allowedHeaders,
      // 允许跨域携带凭证
      credentials: cors.credentials,
      // OPTIONS请求预检结果缓存的时间
      maxAge: cors.maxAge,
    })

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
    this.app.use(
      helmet({
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: false,
      }),
    )
    this.logger.info('Middlewares initialized successfully', Bootstrap.name)
  }

  async checkInitConfig() {
    if (!this.appConfig) {
      await this.app.close()
      throw new Error('Config is not initialized')
    }
  }

  async initPipes(): Promise<void> {
    await this.checkInitConfig()
    this.logger.info('Initializing pipes...', Bootstrap.name)
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
    this.logger.info('Pipes initialized successfully', Bootstrap.name)
  }

  async initGlobalSettings(): Promise<void> {
    await this.checkInitConfig()
    this.logger.info('Initializing global settings...', Bootstrap.name)
    // 日志替换
    this.app.useLogger(this.app.get<WinstonLogger>(LOGGER2_SERVICE_TOKEN))

    // 应用关闭钩子
    this.app.enableShutdownHooks()

    // 信任代理设置(用于节流器)
    this.app.set('trust proxy', 'loopback')

    // 设置全局前缀
    this.app.setGlobalPrefix(this.appConfig.globalPrefix)
    this.logger.info('Global settings initialized successfully', Bootstrap.name)
  }

  async initSwagger(): Promise<void> {
    await this.checkInitConfig()
    const { enabled, title, description, version, ignoreGlobalPrefix, path } = this.swaggerConfig!
    if (!enabled) return
    this.logger.info('Initializing swagger document...', Bootstrap.name)
    const swaggerConfig = new DocumentBuilder()
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
    const swaggerDocument = SwaggerModule.createDocument(this.app, swaggerConfig, {
      ignoreGlobalPrefix,
    })
    SwaggerModule.setup(path, this.app, swaggerDocument, {
      customSiteTitle: title,
    })
    this.logger.info('Swagger document initialized successfully', Bootstrap.name)
  }

  async listen(): Promise<void> {
    await this.checkInitConfig()
    const { name, hostname, port, globalPrefix } = this.appConfig!
    await this.app.listen(port, hostname, async () => {
      const url = await this.app.getUrl()
      this.logger.info(`${name} started on port:${port}`, Bootstrap.name)
      this.logger.info(`${name} started on pid:${APP_PID}`, Bootstrap.name)
      this.logger.info(`Server running at ${url}${globalPrefix ? `/${globalPrefix}` : ''}`, Bootstrap.name)
      this.logger.info(`SwaggerDocument running at ${url}/${this.swaggerConfig?.path}`, Bootstrap.name)
      this.logger.info(`SwaggerDocument-json running at ${url}/${this.swaggerConfig?.path}-json`, Bootstrap.name)
      this.logger.info(`SwaggerDocument-yaml running at ${url}/${this.swaggerConfig?.path}-yaml`, Bootstrap.name)
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
