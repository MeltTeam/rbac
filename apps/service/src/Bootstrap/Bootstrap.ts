import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { IBootstrap } from './IBootstrap'
import type { IAppConfig } from '@/configs'
import { APP_PID } from '@constants/index'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { WINSTON_SERVICE_TOKEN } from '@winston/winston.constant'
import { WinstonService } from '@winston/winston.service'
import cookieParser from 'cookie-parser'
import { APP_CONFIG_KEY } from '@/configs'

/** 热更新模块 */
declare const module: any

/** 应用引导类 */
export class Bootstrap implements IBootstrap {
  /** 日志服务 */
  protected logger: WinstonService
  /** 应用配置 */
  protected appConfig: IAppConfig
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
      const logger = new WinstonService()
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
    this.logger.info('Config initialized successfully', Bootstrap.name)
    // ...各种配置
  }

  async initMiddlewares(): Promise<void> {
    await this.checkInitConfig()
    this.logger.info('Initializing middlewares...', Bootstrap.name)
    const { cors } = this.appConfig!
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
      allowedHeaders: cors.headers,
      // 允许跨域携带凭证
      credentials: cors.credentials,
      // OPTIONS请求预检结果缓存的时间
      maxAge: cors.maxAge,
    })

    // 开启cookie解析
    this.app.use(cookieParser())
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
    this.app.useLogger(this.app.get<WinstonService>(WINSTON_SERVICE_TOKEN))

    // 应用关闭钩子
    this.app.enableShutdownHooks()

    // 信任代理设置(用于节流器)
    this.app.set('trust proxy', 'loopback')

    // 设置全局前缀
    this.app.setGlobalPrefix(this.appConfig.globalPrefix)
    this.logger.info('Global settings initialized successfully', Bootstrap.name)
  }

  async listen(): Promise<void> {
    await this.checkInitConfig()
    const { name, hostname, port, globalPrefix } = this.appConfig!
    await this.app.listen(port, hostname, async () => {
      const url = await this.app.getUrl()
      this.logger.info(`${name} started on port:${port}`, Bootstrap.name)
      this.logger.info(`${name} started on pid:${APP_PID}`, Bootstrap.name)
      this.logger.info(`Server running at ${url}${globalPrefix ? `/${globalPrefix}` : ''}`, Bootstrap.name)
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
