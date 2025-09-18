import type { Request } from 'express'
import type { JwtFromRequestFunction } from 'passport-jwt'
import type { JwtConfigType } from '@/configs'
import type { IPayLoad } from '@/infrastructure/jwt2/IJwt2'
import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-jwt'
import { JWT_CONFIG_KEY } from '@/configs'
import { TokenType } from '@/infrastructure/jwt2/jwt2.constant'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { AuthService } from '../auth.service'

const getJwt: JwtFromRequestFunction = (request: Request) => {
  if (!request) return null
  if (request.headers.authorization) return request.headers.authorization?.split(' ')[1]
  if (request.cookies.accessToken) return request.cookies.accessToken
  return null
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService<ILoggerCls>,
    private readonly configService: ConfigService,
  ) {
    const {
      serviceConfig: { secret },
    } = configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
    super({
      jwtFromRequest: getJwt,
      ignoreExpiration: false,
      // passReqToCallback: true,
      secretOrKey: secret!,
    })
  }

  async validate(payload: IPayLoad) {
    // 不是访问令牌
    if (payload.tokenType !== TokenType.ACCESS_TOKEN) throw new UnauthorizedException()
    const { tokenType, iat, exp, ...userInfo } = payload
    this.clsService.set(LOGGER_CLS.USER_INFO, userInfo)
    return payload
  }
}
