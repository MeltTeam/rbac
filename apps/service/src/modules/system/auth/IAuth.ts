import type { SEND_EMAIL_CAPTCHA_OK } from '@captcha/captcha.constant'
import type { SvgCaptchaVO } from './vos'
import { EmailCaptchaDTO } from './dtos/emailCaptcha.dto'

/** 登录类型 */
export type LoginType = 'email' | 'svg'
export interface IAuthController {
  /** svg验证码接口(登录) */
  loginBySvgCaptcha: () => Promise<SvgCaptchaVO>
  /**
   * 邮箱验证码接口(登录)
   * @param emailCaptchaDTO 邮箱验证码接口参数校验
   */
  loginByEmailCaptcha: (emailCaptchaDTO: EmailCaptchaDTO) => Promise<typeof SEND_EMAIL_CAPTCHA_OK>
  // loginBySvg: (loginBySvgDTO: LoginBySvgDTO, res: ExpressResponse, req: ExpressRequest) => Promise<LoginVO>
}

export interface IAuthService {}
