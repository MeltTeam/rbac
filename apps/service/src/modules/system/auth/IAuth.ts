// import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface IAuthController {
  /** svg验证码接口(登录) */
  // loginBySvgCaptcha: () => Promise<SvgCaptchaVO>
  // loginBySvg: (loginBySvgDTO: LoginBySvgDTO, res: ExpressResponse, req: ExpressRequest) => Promise<LoginVO>
  /** 邮箱验证码接口(登录) */
  // loginByEmailCaptcha: (EmailCaptchaDTO: EmailCaptchaDTO) => Promise<string>
}

/** 登录类型 */
export type LoginType = 'email' | 'svg'
