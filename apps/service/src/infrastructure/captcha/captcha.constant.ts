import { CAPTCHA_CONFIG_KEY } from '@/configs'

export const CAPTCHA_REDIS_CLIENT_TOKEN = Symbol(CAPTCHA_CONFIG_KEY)

/** 邮件验证码发送成功 */
export const SEND_EMAIL_CAPTCHA_VO = '邮件验证码发送成功' as const
