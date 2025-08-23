/** 用户信息 */
export interface IUserInfo {
  /** 用户ID */
  id: string
  /** 用户名 */
  name: string
  /** 登录IP */
  loginIp: string
  /** 登录时间 */
  loginAt: Date
}
/** 登录接口响应数据 */
export interface ILoginVO {
  /** 用户信息 */
  userInfo: IUserInfo
  /** 短TOKEN */
  accessToken: string
  /** 长TOKEN */
  refreshToken: string
}
/** svg验证码接口响应数据 */
export interface ISvgCaptchaVO {
  /** 验证码凭证 */
  token: string
  /** svg验证码 */
  svg: string
}
