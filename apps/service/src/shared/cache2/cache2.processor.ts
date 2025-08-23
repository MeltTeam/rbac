import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { CACHE_QUEUE_TOKEN } from '@queues/queues.constant'
import { Job } from 'bullmq'
import { Cache2Service } from './cache2.service'

/** 缓存队列处理 */
@Processor(CACHE_QUEUE_TOKEN)
export class Cache2Processor extends WorkerHost {
  logger: Logger

  constructor(private readonly cache2Service: Cache2Service) {
    super()
    this.logger = new Logger(Cache2Processor.name)
  }

  /** 处理 */
  async process(job: Job) {
    try {
      const { key } = job.data
      await this.cache2Service.del(key)
      await job.log(`延迟删除成功`)
    } catch (e) {
      this.logger.error(`延迟删除失败:${e.message}`)
      await job.log(`延迟删除失败:${e.message}`)
      throw e
    }
  }
}
