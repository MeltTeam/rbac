import type { ICacheJobData } from './ICache'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { LoggingService } from '@/common/infra/logging'
import { CACHE_QUEUE_COMPLETE, CACHE_QUEUE_FAIL, CACHE_QUEUE_TOKEN } from '@/common/infra/queue'
import { CacheService } from './cache.service'

/** 缓存队列处理 */
@Processor(CACHE_QUEUE_TOKEN, {
  removeOnComplete: { count: CACHE_QUEUE_COMPLETE },
  removeOnFail: { count: CACHE_QUEUE_FAIL },
})
export class CacheProcessor extends WorkerHost {
  constructor(
    private readonly cacheService: CacheService,
    private readonly loggingService: LoggingService,
  ) {
    super()
  }

  /** 处理 */
  async process(job: Job<ICacheJobData>) {
    const { type, key, value, ttl } = job.data
    try {
      switch (type) {
        case 'set':
          await this.cacheService.set(key, value, ttl)
          break
        case 'del':
          await this.cacheService.del(key)
          break
        case 'update':
          await this.cacheService.update(key, value)
          break
      }
    } catch (error) {
      this.loggingService.error(`延迟${type}失败:${error.message}`)
      await job.log(`延迟${type}失败:${error.message}`)
      throw error
    }
  }
}
