import type { EmailConfigType } from '@/configs'
import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EMAIL_CONFIG_KEY } from '@/configs'
import { EmailProcessor } from './email.processor'
import { EmailService } from './email.service'

/** 邮箱模块 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<EmailConfigType>(EMAIL_CONFIG_KEY)!
        return config
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService, EmailProcessor],
})
export class EmailModule {}
