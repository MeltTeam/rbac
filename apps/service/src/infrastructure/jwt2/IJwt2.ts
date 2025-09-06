import type { Response as ExpressResponse } from 'express'
import type { UserInfo } from '@/modules/system/auth/vos'

/** token类型 */
export type TokenType = 'refreshToken' | 'accessToken'
/** redis存储token的数据结构 */
export interface IRedisToken {
  /** 长token */
  refreshToken: string
  /** 短token */
  accessToken: string
}

export interface IPayLoad {
  id: string
  username: string
  tokenType: TokenType
}

export interface ISetRedisTokenOptions {
  /** 用户ID */
  userId: string
  /** 长token */
  refreshToken: string
  /** 短token */
  accessToken: string
  /** 过期时间 */
  ttl: number
}
export interface IJwt2Service {
  /**
   * 生成Payload
   * @param userInfo 用户信息
   * @param tokenType token类型
   */
  generatePayload: (userInfo: UserInfo, tokenType: TokenType) => Promise<IPayLoad>
  /**
   * 生成Token
   * @param userInfo 用户信息
   * @param expiresIn 过期时间
   * @param tokenType token类型
   */
  generateToken: (userInfo: UserInfo, expiresIn: string, secret: string, tokenType: TokenType) => Promise<string>
  /**
   * 设置cookie
   * @param res 响应对象
   * @param key cookie存储token的key
   * @param value 值
   * @param maxAge 过期时间
   */
  setCookieToken: (res: ExpressResponse, key: string, value: string, maxAge: number) => Promise<void>
  /**
   * 删除cookie
   * @param res 响应对象
   * @param key cookie存储token的key
   */
  delCookieToken: (res: ExpressResponse, key: TokenType) => Promise<void>
  /**
   * 把token信息存进redis
   * @param setTokenOptions 配置
   */
  setRedisToken: (setRedisTokenOptions: ISetRedisTokenOptions) => Promise<void>
  /**
   * 删除redis中的token信息
   * @param userId 用户ID
   */
  delRedisToken: (userId: string) => Promise<void>

  /**
   * 验证刷新token
   * @param token 令牌
   * @param secret 加密盐
   */
  // validateRefreshToken: (token: string, secret?: string | Buffer<ArrayBufferLike>) => Promise<UserInfo>
}
