import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { CacheService } from '../cache.service'

@Processor('cache')
export class CacheProcessor extends WorkerHost {
  logger: Logger

  constructor(private readonly cacheService: CacheService) {
    super()
    this.logger = new Logger(CacheProcessor.name)
  }

  async process(job: Job) {
    try {
      const { key } = job.data
      await this.cacheService.del(key)
      await job.log(`延迟删除成功`)
    } catch (e) {
      this.logger.error(`延迟删除失败:${e.message}`)
      await job.log(`延迟删除失败:${e.message}`)
      throw e
    }
  }
}
