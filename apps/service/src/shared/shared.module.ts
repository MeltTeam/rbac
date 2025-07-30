import { Global, Module } from '@nestjs/common'
import { Cache2Module } from './cache2/cache2.module'
import { CaptchaModule } from './captcha/captcha.module'
import { DatabaseModule } from './database/database.module'
import { EmailModule } from './email/email.module'
import { QueuesModule } from './queues/queues.module'
import { Throttler2Module } from './throttler2/throttler2.module'
/** 共享模块 */
@Global()
@Module({
  imports: [DatabaseModule, Cache2Module, QueuesModule, EmailModule, CaptchaModule, Throttler2Module],
  exports: [DatabaseModule, Cache2Module, QueuesModule, EmailModule, CaptchaModule, Throttler2Module],
})
export class SharedModule {}
