import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import type { ConfigFactory } from '@nestjs/config'
import { BusinessModule } from '@business/business.module'
import { FormatResFilter } from '@filters/formatRes.filter'
import { FormatResInterceptor } from '@interceptors/formatRes.interceptor'
import { LoggerMiddleware } from '@middlewares/logger.middleware'
import { Module } from '@nestjs/common'
import { ConfigModule as Config2Module } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { SharedModule } from '@shared/shared.module'
import { Throttler2ExceptionFilter } from '@throttler2/throttler2.filter'
import { Throttler2Guard } from '@throttler2/throttler2.guard'
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
    /** 请求上下文模块 */
    ClsModule.forRoot({ global: true }),
    SharedModule,
    BusinessModule,
  ],
  providers: [
    // 节流器守卫
    { provide: APP_GUARD, useClass: Throttler2Guard },
    // 节流器异常过滤器
    { provide: APP_FILTER, useClass: Throttler2ExceptionFilter },
    // 全局异常过滤器
    { provide: APP_FILTER, useClass: FormatResFilter },
    // 全局响应拦截器
    { provide: APP_INTERCEPTOR, useClass: FormatResInterceptor },
  ],
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
