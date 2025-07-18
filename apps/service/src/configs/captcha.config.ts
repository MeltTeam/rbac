import type { ConfigType } from '@nestjs/config'
import type { RedisOptions } from 'ioredis'
import { registerAs } from '@nestjs/config'
import { CaptchaValidationSchema } from './validationSchema'

/** captcha配置key */
export const CAPTCHA_CONFIG_KEY = 'CAPTCHA_CONFIG_KEY'

/** captcha配置 */
export const CaptchaConfig = registerAs(CAPTCHA_CONFIG_KEY, (): RedisOptions => {
  const { error, value } = CaptchaValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${CaptchaConfig.name}:${error.message}`)
  return {
    host: value.CAPTCHA_REDIS_HOST ?? value.REDIS_HOST,
    port: value.CAPTCHA_REDIS_PORT ?? value.REDIS_PORT,
    username: value.CAPTCHA_REDIS_USERNAME ?? value.REDIS_USERNAME,
    password: value.CAPTCHA_REDIS_PASSWORD ?? value.REDIS_PASSWORD,
    db: value.CAPTCHA_REDIS_DB,
  }
})

/** captcha配置类型 */
export type CaptchaConfigType = ConfigType<typeof CaptchaConfig>
