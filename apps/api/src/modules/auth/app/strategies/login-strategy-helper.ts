import type { Request } from 'express'
import type { ICaptchaInfo } from '../../domain/services/ICaptchaService'
import type { IAuthUserService, ILoginCredentials, TIdentifierType } from '../services/IAuthUserService'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { REQ_CTX } from '@/common/infra'
import { CaptchaService } from '../../domain'

/** 登录策略辅助类 - 提供公共验证逻辑 */
export class LoginStrategyHelper {
  constructor(
    private readonly authService: IAuthUserService,
    private readonly captchaService: CaptchaService,
    private readonly clsService: ClsService,
    private readonly extractCredentials: (req: Request) => ILoginCredentials,
    private readonly getCaptchaInfo: (req: Request) => ICaptchaInfo,
    private readonly getIdentifierType: () => TIdentifierType,
  ) {}

  async validate(req: Request, em: EntityManager): Promise<boolean> {
    const credentials = this.extractCredentials(req)
    const captchaInfo = this.getCaptchaInfo(req)

    await this.captchaService.validateCaptcha(this.captchaService.getCaptchaKey(captchaInfo), credentials.captcha)

    const user = await this.authService.getUserByIdentifier(credentials.identifier, this.getIdentifierType(), em)

    const isValid = await this.authService.validatePassword(credentials.password, user)
    if (!isValid) {
      throw new BusinessException(ExceptionCode.AUTH_INCORRECT_PASSWORD, ExceptionCodeTextMap)
    }

    await this.authService.updateLoginInfo(user, em)
    this.clsService.set<string>(REQ_CTX.USER_ID, user.id)

    return true
  }
}
