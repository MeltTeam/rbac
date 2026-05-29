import type { Response } from 'express'

/** Token Cookie服务接口 */
export interface ITokenCookieService {
  /** 设置刷新令牌到Cookie */
  setRefreshCookie: (res: Response, refreshToken: string) => Promise<void>
  /** 清除所有认证相关Cookie */
  clearAuthCookies: (res: Response) => Promise<void>
}
