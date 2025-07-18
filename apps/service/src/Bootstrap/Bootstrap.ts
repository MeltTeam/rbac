import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IBootstrap } from './IBootstrap'
import type { AppConfigInterface } from '@/configs'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { APP_PID } from '@/common/constants'
// import { FormatExceptionFilter } from '@/common/http/filters/formatException.filter'
// import { ThrottlerExceptionFilter } from '@/common/http/filters/throttlerException.filter'
// import { FormatResponseInterceptor } from '@/common/http/interceptors/formatResponse.interceptor'
import { APP_CONFIG_KEY } from '@/configs'

/** 启动类 */
export class Bootstrap implements IBootstrap {
  static app: NestExpressApplication
  protected configService: ConfigService
  protected logger: Logger
  protected appConfig: AppConfigInterface
  public static instance: Bootstrap
  private constructor(app: NestExpressApplication) {
    this.logger = new Logger(Bootstrap.name)
    Bootstrap.app = app
    this.configService = Bootstrap.app.get(ConfigService)
    this.appConfig = this.configService.get<AppConfigInterface>(APP_CONFIG_KEY)!
  }

  /**
   * 创建实例
   * @param rootModule 根模块
   */
  public static async create(rootModule: any) {
    if (!Bootstrap.instance) {
      const app = await NestFactory.create<NestExpressApplication>(rootModule)
      Bootstrap.instance = new Bootstrap(app)
    }
    return Bootstrap.instance
  }

  async init(): Promise<void> {
    const app = Bootstrap.app
    /** 跨域 */
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = ['http://127.0.0.1:4002', 'http://localhost:4002']
        const isLocalNetwork = /^http:\/\/192\.168\.0\.\d{1,3}(?::\d+)?$/.test(origin)
        const isAllowed = allowedOrigins.includes(origin) || isLocalNetwork
        callback(null, isAllowed)
      },
      methods: 'GET,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true,
      maxAge: 3600,
    })
    // 开启cookie解析
    app.use(cookieParser())

    /** 添加全局管道验证器 */
    app.useGlobalPipes(
      new ValidationPipe({
        /** 配合 @Allow 装饰器添加到白名单 */
        whitelist: true,
        /** 自动类型转换 */
        transform: true,
        /** 白名单里面没有的属性会报错 */
        forbidNonWhitelisted: true,
      }),
    )

    /** 添加全局响应拦截器 */
    // app.useGlobalInterceptors(new FormatResponseInterceptor())

    /** X-Forwarded-For读原始IP */
    app.set('trust proxy', 'loopback')

    /** 添加全局异常过滤器 */
    // app.useGlobalFilters(new FormatExceptionFilter(), new ThrottlerExceptionFilter())

    const { globalPrefix } = this.appConfig!
    /** 设置全局前缀 */
    app.setGlobalPrefix(globalPrefix)
  }

  async listen(): Promise<void> {
    const { name, hostname, port, globalPrefix } = this.appConfig!
    await Bootstrap.app.listen(port, hostname, async () => {
      const url = await Bootstrap.app.getUrl()
      this.logger.log(`${name} started on port:${port}`)
      this.logger.log(`${name} started on pid:${APP_PID}`)
      this.logger.log(`Server running at ${url}${globalPrefix ? `/${globalPrefix}` : ''}`)
    })
  }
}
