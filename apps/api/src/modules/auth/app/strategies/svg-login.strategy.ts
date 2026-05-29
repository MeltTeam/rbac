import type { Request } from 'express'
import type { ICaptchaInfo } from '../../domain/services/ICaptchaService'
import type { SvgLoginDTO } from '../dto'
import type { ILoginCredentials } from '../services/IAuthUserService'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { EntityManager } from 'typeorm'
import { CaptchaService } from '../../domain'
import { AuthUserService } from '../services'
import { LoginStrategyHelper } from './login-strategy-helper'

/** SVG登录策略 */
@Injectable()
export class SvgLoginStrategy extends PassportStrategy(Strategy, 'svg-login') {
  private readonly helper: LoginStrategyHelper

  constructor(
    authService: AuthUserService,
    captchaService: CaptchaService,
    clsService: ClsService,
    private readonly em: EntityManager,
  ) {
    super()
    this.helper = new LoginStrategyHelper(
      authService,
      captchaService,
      clsService,
      this.extractCredentials.bind(this),
      this.getCaptchaInfo.bind(this),
      this.getIdentifierType.bind(this),
    )
  }

  async validate(req: Request) {
    return this.em.transaction((em: EntityManager) => this.helper.validate(req, em))
  }

  protected extractCredentials(req: Request): ILoginCredentials {
    const { name, pwd, captcha } = req.body as SvgLoginDTO
    return { identifier: name, password: pwd, captcha }
  }

  protected getCaptchaInfo(req: Request): ICaptchaInfo {
    const { token } = req.body as SvgLoginDTO
    return { type: 'svg', name: 'login', id: token }
  }

  protected getIdentifierType() {
    return 'svg' as const
  }
}
