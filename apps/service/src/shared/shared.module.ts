import { Cache2Module } from '@cache2/cache2.module'
import { CaptchaModule } from '@captcha/captcha.module'
import { DatabaseModule } from '@database/database.module'
import { EmailModule } from '@email/email.module'
import { Jwt2Module } from '@jwt2/jwt2.module'
import { Global, Module } from '@nestjs/common'
import { QueuesModule } from '@queues/queues.module'
import { Throttler2Module } from '@throttler2/throttler2.module'

/** 共享基建模块 */
@Global()
@Module({
  imports: [DatabaseModule, Throttler2Module, QueuesModule, Cache2Module, CaptchaModule, EmailModule, Jwt2Module],
  exports: [DatabaseModule, Throttler2Module, QueuesModule, Cache2Module, CaptchaModule, EmailModule, Jwt2Module],
})
export class SharedModule {}
