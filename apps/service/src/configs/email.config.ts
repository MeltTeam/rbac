import type { MailerOptions } from '@nestjs-modules/mailer'
import type { ConfigType } from '@nestjs/config'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { registerAs } from '@nestjs/config'
import { getPath } from '@/common/utils'
import { EmailValidationSchema } from './validationSchema'

/** email配置key */
export const EMAIL_CONFIG_KEY = 'EMAIL_CONFIG_KEY'

/** email配置 */
export const EmailConfig = registerAs(EMAIL_CONFIG_KEY, (): MailerOptions => {
  const { error, value } = EmailValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${EmailConfig.name}:${error.message}`)
  return {
    /** 可以设置多个邮箱服务源 */
    transports: {
      qq: {
        host: value.EMAIL_HOST,
        port: value.EMAIL_PORT,
        secure: value.EMAIL_SECURE,
        auth: {
          user: value.EMAIL_USER,
          pass: value.EMAIL_PASS,
        },
      },
    },
    template: {
      dir: getPath(value.EMAIL_TEMPLATE_DIR),
      adapter: new EjsAdapter(),
      options: {
        strict: true,
      },
    },
  }
})
/** 提供给邮箱队列消费者遍历邮箱服务源的,对应邮箱配置中transports的key(可以设置多个邮箱服务源) */
export const EMAIL_SERVICE_KEYS = ['qq']
/** email配置类型 */
export type EmailConfigType = ConfigType<typeof EmailConfig>
