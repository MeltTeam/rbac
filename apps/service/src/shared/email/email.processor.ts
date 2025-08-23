import type SMTPConnection from 'nodemailer/lib/smtp-connection'
import type { AppConfigType, EmailConfigType } from '@/configs'
import { MailerService } from '@nestjs-modules/mailer'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EMAIL_QUEUE_TOKEN } from '@queues/queues.constant'
import { Job } from 'bullmq'
import { APP_CONFIG_KEY, EMAIL_CONFIG_KEY, EMAIL_SERVICE_KEYS } from '@/configs'

/** 邮件队列处理 */
@Processor(EMAIL_QUEUE_TOKEN)
export class EmailProcessor extends WorkerHost {
  logger: Logger

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super()
    this.logger = new Logger(EmailProcessor.name)
  }

  /** 处理 */
  async process(job: Job) {
    const { name: appName } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const { transports } = this.configService.get<EmailConfigType>(EMAIL_CONFIG_KEY)!
    let lastError: Error | null = null
    const { fromName, ...data } = job.data
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
      } catch (e) {
        lastError = e
        this.logger.debug(e.message)
        await job.log(`邮件发送失败:${e.message}`)
      }
    }
    if (lastError) throw lastError
  }
}
