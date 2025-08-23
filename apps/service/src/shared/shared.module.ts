import { Cache2Module } from '@cache2/cache2.module'
import { DatabaseModule } from '@database/database.module'
import { HealthModule } from '@health/health.module'
import { Global, Module } from '@nestjs/common'
import { QueuesModule } from '@queues/queues.module'
import { Throttler2Module } from '@throttler2/throttler2.module'
/** 共享模块 */
@Global()
@Module({
  imports: [DatabaseModule, Throttler2Module, QueuesModule, Cache2Module, HealthModule],
  exports: [DatabaseModule, Throttler2Module, QueuesModule, Cache2Module, HealthModule],
})
export class SharedModule {}
