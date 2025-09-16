import type SMTPConnection from 'nodemailer/lib/smtp-connection'
import type { ISendEmailOptions } from './IEmail'
import type { AppConfigType, EmailConfigType } from '@/configs'
import { MailerService } from '@nestjs-modules/mailer'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { ConfigService } from '@nestjs/config'
import { Job } from 'bullmq'
import { APP_CONFIG_KEY, EMAIL_CONFIG_KEY, EMAIL_SERVICE_KEYS } from '@/configs'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'
import { EMAIL_QUEUE_TOKEN } from '@/infrastructure/queues/queues.constant'

/** 邮件队列处理 */
@Processor(EMAIL_QUEUE_TOKEN)
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly logger2Service: Logger2Service,
  ) {
    super()
  }

  /** 处理 */
  async process(job: Job) {
    const { name: appName } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const { transports } = this.configService.get<EmailConfigType>(EMAIL_CONFIG_KEY)!
    let lastError: Error | null = null
    const { fromName, ...data } = job.data as ISendEmailOptions
    for (const transport of EMAIL_SERVICE_KEYS) {
      try {
        const res = await this.mailerService.sendMail({
          transporterName: transport,
          ...data,
          from: `"${appName ?? 'test'}" <${(transports![transport] as SMTPConnection.Options)?.auth?.user}>`,
          sender: `${fromName ?? 'test'}`,
          date: new Date(),
        })
        await job.log(JSON.stringify(res))
        return
      } catch (error) {
        lastError = error
        this.logger2Service.error(`邮件发送失败:${error.message}`, EmailProcessor.name)
        await job.log(`邮件发送失败:${error.message}`)
      }
    }
    if (lastError) throw lastError
  }
}
