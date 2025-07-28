// import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import type { EmailCaptchaDto } from '../dtos'
import type { SvgCaptchaVo } from '../vos'

export interface IAuthController {
  /** svg验证码接口(登录) */
  loginBySvgCaptcha: () => Promise<SvgCaptchaVo>
  // loginBySvg: (loginBySvgDto: LoginBySvgDto, res: ExpressResponse, req: ExpressRequest) => Promise<LoginVo>
  /** 邮箱验证码接口(登录) */
  loginByEmailCaptcha: (EmailCaptchaDto: EmailCaptchaDto) => Promise<string>
}
