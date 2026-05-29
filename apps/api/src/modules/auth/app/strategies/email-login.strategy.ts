import type { Request } from 'express'
import type { ICaptchaInfo } from '../../domain/services/ICaptchaService'
import type { EmailLoginDTO } from '../dto'
import type { ILoginCredentials } from '../services/IAuthUserService'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { EntityManager } from 'typeorm'
import { CaptchaService } from '../../domain'
import { AuthUserService } from '../services'
import { LoginStrategyHelper } from './login-strategy-helper'

/** 邮箱登录策略 */
@Injectable()
export class EmailLoginStrategy extends PassportStrategy(Strategy, 'email-login') {
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
    const { email, pwd, captcha } = req.body as EmailLoginDTO
    return { identifier: email, password: pwd, captcha }
  }

  protected getCaptchaInfo(req: Request): ICaptchaInfo {
    const { email } = req.body as EmailLoginDTO
    return { type: 'email', name: 'login', id: email }
  }

  protected getIdentifierType() {
    return 'email' as const
  }
}
