import type { IEmailJobData, IEmailService } from './IEmail'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { LogContextMethod } from '@/common/deco'
import { ExceptionCode, ExceptionCodeTextMap, QueueException } from '@/common/exceptions'
import { LoggingService } from '@/common/infra/logging'
import { EMAIL_QUEUE_TOKEN, QueueModule } from '@/common/infra/queue'
import { redisIsOk, uuid_v4 } from '@/common/utils'

/** 邮件服务实现 */
@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @InjectQueue(EMAIL_QUEUE_TOKEN) private readonly emailQueue: Queue<IEmailJobData>,
    private readonly logging: LoggingService,
  ) {}

  @LogContextMethod()
  async sendEmail<T = any>(options: IEmailJobData<T>) {
    if (!redisIsOk(QueueModule.initRedis!.redisClient)) throw new QueueException(ExceptionCode.QUEUE_SERVICE_ERROR, ExceptionCodeTextMap)
    await this.emailQueue.add('sendEmail', options, {
      /** 失败重试 */
      attempts: 3,
      jobId: uuid_v4(),
      /** 指数退避重试 */
      backoff: { type: 'exponential', delay: 1000 },
    })
    return true
  }
}
