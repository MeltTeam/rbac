import type { ITokenInfo } from '../IJwtTokenService'
import type { ITokenCacheService } from '../ITokenCacheService'
import type { IJwtConfig } from '@/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LogContextClass } from '@/common/deco'
import { CacheService } from '@/common/infra'
import { JWT_CONFIG_KEY } from '@/config'
import { BLACKLIST_DELAY_MS } from '../../../domain/constants'

/** Token缓存服务实现 */
@Injectable()
@LogContextClass()
export class TokenCacheService implements ITokenCacheService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  getRefreshKey(userId: string): string {
    return `jwt:refresh:${userId}`
  }

  async setRefreshCache(userId: string, refreshToken: string): Promise<void> {
    const { refreshTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const refreshKey = this.getRefreshKey(userId)
    await this.cacheService.set(refreshKey, refreshToken, refreshTokenCookieExpiresIn)
  }

  async getRefreshCache(userId: string): Promise<string | null> {
    const refreshKey = this.getRefreshKey(userId)
    return await this.cacheService.get<null | string>(refreshKey)
  }

  async delRefreshCache(userId: string): Promise<void> {
    const refreshKey = this.getRefreshKey(userId)
    await this.cacheService.del(refreshKey)
  }

  getBlackListKey(tokenInfo: ITokenInfo): string {
    const { jti, type } = tokenInfo
    return `jwt:blacklist:${type}:${jti}`
  }

  async setBlackListCache(tokenInfo: ITokenInfo, token: string, maxAge: number): Promise<void> {
    const blackListKey = this.getBlackListKey(tokenInfo)
    await this.cacheService.set(blackListKey, token, maxAge)
  }

  async delaySetBlackListCache(tokenInfo: ITokenInfo, token: string, maxAge: number): Promise<void> {
    const blackListKey = this.getBlackListKey(tokenInfo)
    await this.cacheService.delayedSet(blackListKey, token, maxAge, BLACKLIST_DELAY_MS)
  }

  async getBlackListCache(tokenInfo: ITokenInfo): Promise<string | null> {
    const blackListKey = this.getBlackListKey(tokenInfo)
    return await this.cacheService.get<null | string>(blackListKey)
  }
}
