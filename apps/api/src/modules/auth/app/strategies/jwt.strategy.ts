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

/** jwt策略 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly tokenCacheService: TokenCacheService,
    private readonly tokenCookieService: TokenCookieService,
    private readonly clsService: ClsService,
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {
    super()
  }

  async validate(req: Request) {
    const accessToken = this.jwtTokenService.getAccessToken(req)
    if (!accessToken) throw new UnauthorizedException()

    let accessInfo: ITokenInfo
    try {
      accessInfo = await this.jwtTokenService.verifyToken(accessToken)
    } catch {
      throw new UnauthorizedException()
    }

    if (accessInfo.type !== 'access') throw new UnauthorizedException()

    const hasBlackListAccess = await this.tokenCacheService.getBlackListCache(accessInfo)
    if (hasBlackListAccess) throw new UnauthorizedException()

    const refreshToken = await this.tokenCacheService.getRefreshCache(accessInfo.sub)
    if (!refreshToken) {
      const { accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
      await Promise.all([
        this.tokenCacheService.setBlackListCache(accessInfo, accessToken, accessTokenCookieExpiresIn),
        this.tokenCacheService.delRefreshCache(accessInfo.sub),
        this.tokenCookieService.clearAuthCookies(req.res!),
      ])
      this.loggingService.debug(`用户已在其他设备登录: userId=${accessInfo.sub}`)
      throw new UnauthorizedException()
    }

    this.clsService.set<string>(REQ_CTX.USER_ID, accessInfo.sub)
    return true
  }
}
