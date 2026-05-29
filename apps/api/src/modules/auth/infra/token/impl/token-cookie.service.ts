import type { Response } from 'express'
import type { ITokenCookieService } from '../ITokenCookieService'
import { Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN } from '@/config'

/** Token Cookie服务实现 */
@Injectable()
@LogContextClass()
export class TokenCookieService implements ITokenCookieService {
  async setRefreshCookie(res: Response, refreshToken: string): Promise<void> {
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      maxAge: DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
      sameSite: 'lax',
      secure: false,
    })
  }

  async clearAuthCookies(res: Response): Promise<void> {
    res.clearCookie('refresh', { httpOnly: true, maxAge: 0, sameSite: 'lax', secure: false })
    res.clearCookie('Authorization', { httpOnly: true, maxAge: 0, sameSite: 'lax', secure: false })
    res.clearCookie('authorization', { httpOnly: true, maxAge: 0, sameSite: 'lax', secure: false })
  }
}
