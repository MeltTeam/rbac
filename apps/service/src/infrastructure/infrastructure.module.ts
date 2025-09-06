import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClsModule } from 'nestjs-cls'
import { Cache2Module } from '@/infrastructure/cache2/cache2.module'
import { CaptchaModule } from '@/infrastructure/captcha/captcha.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { EmailModule } from '@/infrastructure/email/email.module'
import { Jwt2Module } from '@/infrastructure/jwt2/jwt2.module'
import { WINSTON_DEFAULT_CONFIG } from '@/infrastructure/logger2/logger2.constant'
import { Logger2Module } from '@/infrastructure/logger2/logger2.module'
import { QueuesModule } from '@/infrastructure/queues/queues.module'
import { Throttler2Module } from '@/infrastructure/throttler2/throttler2.module'

/** 基建模块 */
@Global()
@Module({
  imports: [
    /** 请求上下文模块 */
    ClsModule.forRoot({ global: true }),
    DatabaseModule,
    Throttler2Module,
    QueuesModule,
    Logger2Module.forRootAsync({
      isGlobal: true,
      async useFactory() {
        return WINSTON_DEFAULT_CONFIG
      },
      inject: [ConfigService],
    }),
    Cache2Module,
    CaptchaModule,
    EmailModule,
    Jwt2Module,
  ],
  exports: [ClsModule, DatabaseModule, Throttler2Module, QueuesModule, Logger2Module, Cache2Module, CaptchaModule, EmailModule, Jwt2Module],
})
export class InfrastructureModule {}
