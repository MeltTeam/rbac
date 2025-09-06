import type { IEmailService, ISendEmailOptions } from './IEmail'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { SystemException } from '@/common/exceptions'
import { EMAIL_QUEUE_TOKEN } from '@/infrastructure/queues/queues.constant'

/** 邮件服务 */
@Injectable()
export class EmailService implements IEmailService {
  constructor(@InjectQueue(EMAIL_QUEUE_TOKEN) private readonly emailQueue: Queue) {}

  async sendEmail<T = any>(options: ISendEmailOptions<T>) {
    try {
      await this.emailQueue.add('sendEmail', options, {
        /** 失败重试 */
        attempts: 3,
        /** 指数退避重试 */
        backoff: { type: 'exponential', delay: 1000 },
      })
      return true
    } catch (error) {
      throw new SystemException({ error })
    }
  }
}
