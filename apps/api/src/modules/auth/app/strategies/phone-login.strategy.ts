import type { Request } from 'express'
import type { ICaptchaInfo } from '../../domain/services/ICaptchaService'
import type { PhoneLoginDTO } from '../dto'
import type { ILoginCredentials } from '../services/IAuthUserService'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { EntityManager } from 'typeorm'
import { CaptchaService } from '../../domain'
import { AuthUserService } from '../services'
import { LoginStrategyHelper } from './login-strategy-helper'

/** 手机号登录策略 */
@Injectable()
export class PhoneLoginStrategy extends PassportStrategy(Strategy, 'phone-login') {
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
    const { phone, pwd, captcha } = req.body as PhoneLoginDTO
    return { identifier: phone, password: pwd, captcha }
  }

  protected getCaptchaInfo(req: Request): ICaptchaInfo {
    const { phone } = req.body as PhoneLoginDTO
    return { type: 'phone', name: 'login', id: phone }
  }

  protected getIdentifierType() {
    return 'phone' as const
  }
}
