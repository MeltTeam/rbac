import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'
import { CACHE_QUEUE_TOKEN } from '@/infrastructure/queues/queues.constant'
import { Cache2Service } from './cache2.service'

/** 缓存队列处理 */
@Processor(CACHE_QUEUE_TOKEN)
export class Cache2Processor extends WorkerHost {
  constructor(
    private readonly cache2Service: Cache2Service,
    private readonly logger2Service: Logger2Service,
  ) {
    super()
  }

  /** 处理 */
  async process(job: Job) {
    try {
      const { key } = job.data
      await this.cache2Service.del(key)
      await job.log(`延迟删除成功`)
    } catch (error) {
      this.logger2Service.error(`延迟删除失败:${error.message}`, Cache2Processor.name)
      await job.log(`延迟删除失败:${error.message}`)
      throw error
    }
  }
}
