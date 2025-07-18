import { Global, Module } from '@nestjs/common'
import { CacheModule } from './cache/cache.module'
import { DatabaseModule } from './database/database.module'
import { QueuesModule } from './queues/queues.module'
/** 共享模块 */
@Global()
@Module({
  imports: [DatabaseModule, CacheModule, QueuesModule],
  exports: [DatabaseModule, CacheModule, QueuesModule],
})
export class SharedModule {}
