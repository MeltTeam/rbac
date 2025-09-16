import type { ILogger2JobData } from './ILogger2'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { LOGGER_QUEUE_TOKEN } from '@/infrastructure/queues/queues.constant'
import { Logger2Service } from './logger2.service'

/** 日志队列处理 */
@Processor(LOGGER_QUEUE_TOKEN)
export class LoggerProcessor extends WorkerHost {
  constructor(private readonly logger2Service: Logger2Service) {
    super()
  }

  /** 处理 */
  async process(job: Job) {
    try {
      const { context, level, message } = job.data as ILogger2JobData
      this.logger2Service[level](message, context)
      await job.log(`延迟写入日志成功`)
    } catch (error) {
      this.logger2Service.error(`延迟写入日志失败:${error.message}`, LoggerProcessor.name)
      await job.log(`延迟写入日志失败:${error.message}`)
      throw error
    }
  }
}
