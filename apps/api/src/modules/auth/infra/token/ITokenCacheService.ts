import type { ITokenInfo } from './IJwtTokenService'

/** Token缓存服务接口 */
export interface ITokenCacheService {
  /** 获取刷新令牌缓存键名 */
  getRefreshKey: (userId: string) => string
  /** 设置刷新令牌到缓存 */
  setRefreshCache: (userId: string, refreshToken: string) => Promise<void>
  /** 获取刷新令牌缓存 */
  getRefreshCache: (userId: string) => Promise<string | null>
  /** 删除刷新令牌缓存 */
  delRefreshCache: (userId: string) => Promise<void>
  /** 获取黑名单令牌缓存键名 */
  getBlackListKey: (tokenInfo: ITokenInfo) => string
  /** 设置令牌到黑名单缓存 */
  setBlackListCache: (tokenInfo: ITokenInfo, token: string, maxAge: number) => Promise<void>
  /** 延迟设置令牌到黑名单缓存 */
  delaySetBlackListCache: (tokenInfo: ITokenInfo, token: string, maxAge: number) => Promise<void>
  /** 检查令牌是否在黑名单中 */
  getBlackListCache: (tokenInfo: ITokenInfo) => Promise<string | null>
}
