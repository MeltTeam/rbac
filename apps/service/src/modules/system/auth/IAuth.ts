import type { REGISTER_OK } from './auth.constant'
import type { EmailCaptchaDTO } from './dtos/emailCaptcha.dto'
import type { LoginByEmailDTO } from './dtos/loginByEmail.dto'
import type { RegisterByEmailDTO } from './dtos/registerByEmail.dto'
import type { SvgCaptchaVO, UserInfo } from './vos'
import type { SEND_EMAIL_CAPTCHA_OK } from '@/infrastructure/captcha/captcha.constant'

/** 登录类型 */
export type LoginType = 'email' | 'svg'

/** 验证用户参数 */
export interface IValidateUserOptions {
  /** 用户名 */
  name: string
  /** 用户密码 */
  pwd: string
  /** 客户端IP */
  ip: string
}
export interface IAuthController {
  /** svg验证码接口(登录) */
  loginBySvgCaptcha: () => Promise<SvgCaptchaVO>

  /**
   * 邮箱验证码接口(登录)
   * @param emailCaptchaDTO 邮箱验证码接口参数校验
   */
  loginByEmailCaptcha: (emailCaptchaDTO: EmailCaptchaDTO) => Promise<typeof SEND_EMAIL_CAPTCHA_OK>

  /**
   * 邮箱登录接口
   * @param loginByEmailDTO 邮箱登录接口参数校验
   */
  loginByEmail: (loginByEmailDTO: LoginByEmailDTO) => Promise<any>

  /**
   * 邮箱验证码接口(注册)
   * @param emailCaptchaDTO 邮箱验证码接口参数校验
   */
  registerByEmailCaptcha: (emailCaptchaDTO: EmailCaptchaDTO) => Promise<typeof SEND_EMAIL_CAPTCHA_OK>

  /**
   * 邮箱注册接口
   * @param registerByEmailDTO 邮箱注册接口参数校验
   */
  registerByEmail: (registerByEmailDTO: RegisterByEmailDTO) => Promise<typeof REGISTER_OK>
}

export interface IAuthService {
  /**
   * 邮箱注册处理
   * @param registerByEmailDTO 邮箱注册接口参数校验
   */
  handlerRegisterByEmail: (registerByEmailDTO: RegisterByEmailDTO) => Promise<boolean>
  handlerLoginByEmail: (loginByEmailDTO: LoginByEmailDTO) => Promise<any>

  /**
   * 验证用户
   * @param options 验证用户参数
   */
  validateUser: (options: IValidateUserOptions) => Promise<UserInfo>
}
