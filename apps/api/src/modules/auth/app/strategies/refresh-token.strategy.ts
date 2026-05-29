import type { Request } from 'express'
import type { ITokenInfo } from '../../infra/token'
import type { IJwtConfig } from '@/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { JWT_CONFIG_KEY } from '@/config'
import { JwtTokenService, TokenCacheService, TokenCookieService } from '../../infra/token'

/** 刷新令牌策略 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly tokenCacheService: TokenCacheService,
    private readonly tokenCookieService: TokenCookieService,
    private readonly clsService: ClsService,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService,
  ) {
    super()
  }

  async validate(req: Request) {
    const accessToken = this.jwtTokenService.getAccessToken(req)
    const refreshToken = this.jwtTokenService.getRefreshToken(req)
    if (!refreshToken) throw new UnauthorizedException()

    let refreshInfo: ITokenInfo | null = null
    try {
      refreshInfo = await this.jwtTokenService.verifyToken(refreshToken)
    } catch {
      throw new UnauthorizedException()
    }
    if (refreshInfo.type !== 'refresh') throw new UnauthorizedException()

    const hasBlackList = await this.tokenCacheService.getBlackListCache(refreshInfo)
    if (hasBlackList) throw new UnauthorizedException()

    const hasCache = await this.tokenCacheService.getRefreshCache(refreshInfo.sub)
    if (!hasCache) throw new UnauthorizedException()

    if (hasCache !== refreshToken) {
      const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!

      let accessInfoToBlacklist: ITokenInfo | null = null
      if (accessToken) {
        try {
          accessInfoToBlacklist = await this.jwtTokenService.verifyToken(accessToken)
        } catch {}
      }

      await Promise.all([
        this.tokenCacheService.setBlackListCache(refreshInfo, refreshToken, refreshTokenCookieExpiresIn),
        accessInfoToBlacklist ? this.tokenCacheService.setBlackListCache(accessInfoToBlacklist, accessToken!, accessTokenCookieExpiresIn) : null,
        this.tokenCacheService.delRefreshCache(refreshInfo.sub),
        this.tokenCookieService.clearAuthCookies(req.res!),
      ])

      this.loggingService.warn(`令牌篡改检测: userId=${refreshInfo.sub}`)
      throw new UnauthorizedException()
    }

    let accessInfo: ITokenInfo | null = null
    if (accessToken) {
      try {
        accessInfo = await this.jwtTokenService.verifyToken(accessToken)
        if (accessInfo.type !== 'access' || accessInfo.sub !== refreshInfo.sub) {
          this.loggingService.warn(`访问令牌与刷新令牌用户不匹配: accessSub=${accessInfo.sub}, refreshSub=${refreshInfo.sub}`)
          accessInfo = null
        }
      } catch {}
    }

    this.clsService.set<string>(REQ_CTX.USER_ID, refreshInfo.sub)
    this.clsService.set<ITokenInfo>(REQ_CTX.ACCESS_INFO, accessInfo)
    this.clsService.set<string>(REQ_CTX.ACCESS_TOKEN, accessToken)
    this.clsService.set<ITokenInfo>(REQ_CTX.REFRESH_INFO, refreshInfo)
    this.clsService.set<string>(REQ_CTX.REFRESH_TOKEN, refreshToken)
    return true
  }
}
