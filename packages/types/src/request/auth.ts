/** 邮箱验证码接口参数校验 */
export interface IEmailCaptchaDTO {
  /** 邮箱 */
  email: string
}
/** 邮箱登录接口参数校验 */
export interface ILoginByEmailDTO {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 邮箱 */
  email: string
  /** 验证码 */
  captcha: string
}
/** svg登录接口参数校验 */
export interface ILoginBySvgDTO {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码凭证 */
  token: string
  /** 验证码 */
  captcha: string
}
/** 邮箱注册接口参数校验 */
export interface IRegisterByEmailDTO extends ILoginByEmailDTO {}
/** 邮箱重置密码接口参数校验 */
export interface IResetPwdByEmailDTO extends ILoginByEmailDTO {
  /** 确认密码 */
  confirmPwd: string
}
