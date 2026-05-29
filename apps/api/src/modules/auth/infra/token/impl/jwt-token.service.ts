import type { Request } from 'express'
import type { IJwtTokenService, ITokenInfo } from '../IJwtTokenService'
import type { IAppConfig } from '@/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { LogContextClass } from '@/common/deco'
import { APP_CONFIG_KEY } from '@/config'

/** JWT令牌服务实现 */
@Injectable()
@LogContextClass()
export class JwtTokenService implements IJwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(tokenInfo: ITokenInfo, expiresIn: string | number): Promise<string> {
    const { salt: secret } = this.configService.get<IAppConfig>(APP_CONFIG_KEY)!
    return await this.jwtService.signAsync(tokenInfo, { expiresIn, secret })
  }

  async verifyToken(token: string): Promise<ITokenInfo> {
    const { salt: secret } = this.configService.get<IAppConfig>(APP_CONFIG_KEY)!
    return await this.jwtService.verifyAsync<ITokenInfo>(token, { secret })
  }

  getAccessToken(req: Request): string | null {
    const token =
      (req.headers.authorization?.split(' ')[1] as string) ??
      (req.cookies?.Authorization?.split(' ')[1] as string) ??
      (req.cookies?.authorization?.split(' ')[1] as string)
    return token || null
  }

  getRefreshToken(req: Request): string | null {
    const token = (req.cookies?.refresh as string) ?? ((req.body as any)?.refreshToken as string)
    return token || null
  }
}
