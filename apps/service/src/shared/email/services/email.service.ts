import type { IEmailService, ISendEmailOptions } from '../interfaces/IEmailService'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'

@Injectable()
export class EmailService extends BaseModule implements IEmailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {
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
