import type { IBaseValidationSchema } from './IBaseValidationSchema'

/** captcha配置验证接口 */
export interface ICaptchaValidationSchema extends IBaseValidationSchema {
  CAPTCHA_REDIS_HOST?: string
  CAPTCHA_REDIS_PORT?: number
  CAPTCHA_REDIS_USERNAME?: string
  CAPTCHA_REDIS_PASSWORD?: string
  CAPTCHA_REDIS_DB: number
}
