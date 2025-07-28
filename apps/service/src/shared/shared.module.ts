import { Global, Module } from '@nestjs/common'
import { CacheModule } from './cache/cache.module'
import { CaptchaModule } from './captcha/captcha.module'
import { DatabaseModule } from './database/database.module'
import { EmailModule } from './email/email.module'
import { QueuesModule } from './queues/queues.module'
import { ThrottlerModule } from './throttler2/throttler2.module'
/** 共享模块 */
@Global()
@Module({
  imports: [DatabaseModule, CacheModule, QueuesModule, EmailModule, CaptchaModule, ThrottlerModule],
  exports: [DatabaseModule, CacheModule, QueuesModule, EmailModule, CaptchaModule, ThrottlerModule],
})
export class SharedModule {}
