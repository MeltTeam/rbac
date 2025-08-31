import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import type { ConfigFactory } from '@nestjs/config'
import { BusinessModule } from '@business/business.module'
import { HttpExceptionFilter } from '@filters/httpException.filter'
import { systemExceptionFilter } from '@filters/systemException.filter'
import { HttpInterceptor } from '@interceptors/http.interceptor'
import { LoggerMiddleware } from '@middlewares/logger.middleware'
import { Module } from '@nestjs/common'
import { ConfigModule as Config2Module, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { SharedModule } from '@shared/shared.module'
import { Throttler2ExceptionFilter } from '@throttler2/throttler2.filter'
import { Throttler2Guard } from '@throttler2/throttler2.guard'
import { WINSTON_DEFAULT_CONFIG } from '@winston/winston.constant'
import { WinstonModule } from '@winston/winston.module'
import { ClsModule } from 'nestjs-cls'
import { ALL_CONFIG } from '@/configs'
/** 根模块 */
@Module({
  imports: [
    /** 配置模块 */
    Config2Module.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: ['.env.local', `.env.${process.env.ENV_NAME}`, '.env'],
      load: [...Object.values<ConfigFactory>(ALL_CONFIG)],
      cache: true,
    }),
    WinstonModule.forRootAsync({
      isGlobal: true,
      useFactory: async (_configService: ConfigService) => {
        // const { level } = configService.get<WinstonConfigType>(WINSTON_CONFIG_KEY)!
        // const { name } = configService.get<AppConfigType>(APP_CONFIG_KEY)!

        return WINSTON_DEFAULT_CONFIG
      },
      inject: [ConfigService],
    }),
    /** 请求上下文模块 */
    ClsModule.forRoot({ global: true }),
    SharedModule,
    BusinessModule,
  ],
  providers: [
    // 节流器守卫
    { provide: APP_GUARD, useClass: Throttler2Guard },
    { provide: APP_FILTER, useClass: systemExceptionFilter },
    // http异常过滤器
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // 节流器异常过滤器
    { provide: APP_FILTER, useClass: Throttler2ExceptionFilter },
    // http拦截器
    { provide: APP_INTERCEPTOR, useClass: HttpInterceptor },
  ],
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
