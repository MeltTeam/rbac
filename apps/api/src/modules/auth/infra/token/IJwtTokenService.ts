import type { Request } from 'express'
/** 令牌类型 */
export const TOKEN_TYPE = ['access', 'refresh'] as const
export type TTokenType = (typeof TOKEN_TYPE)[number]
export interface ITokenInfo {
  /** 用户ID */
  sub: string
  /** 唯一标识 */
  jti: string
  /** 令牌类型 */
  type: TTokenType
  iat?: number
  exp?: number
}
/** JWT令牌服务接口 */
export interface IJwtTokenService {
  /** 生成Token */
  generateToken: (tokenInfo: ITokenInfo, expiresIn: string | number) => Promise<string>
  /** 验证Token */
  verifyToken: (token: string) => Promise<ITokenInfo>
  /** 获取访问令牌(请求头 > cookie) */
  getAccessToken: (req: Request) => string | null
  /** 获取刷新令牌(cookie > body) */
  getRefreshToken: (req: Request) => string | null
}
