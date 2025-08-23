import type { IEmailService, ISendEmailOptions } from './IEmail'
import { BaseModule } from '@abstracts/index'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { EMAIL_QUEUE_TOKEN } from '@queues/queues.constant'
import { Queue } from 'bullmq'

/** 邮件服务 */
@Injectable()
export class EmailService extends BaseModule implements IEmailService {
  constructor(@InjectQueue(EMAIL_QUEUE_TOKEN) private readonly emailQueue: Queue) {
    super()
  }

  async sendEmail<T = any>(options: ISendEmailOptions<T>) {
    try {
      await this.emailQueue.add('sendEmail', options, {
        /** 失败重试 */
        attempts: 3,
        /** 指数退避重试 */
        backoff: { type: 'exponential', delay: 1000 },
      })
      return true
    } catch (e) {
      this.logger.error(`${this.sendEmail.name}:${e.message}`)
      return false
    }
  }
}
