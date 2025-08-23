import type { IAuthController } from './IAuth'
import { BaseModule } from '@abstracts/index'
import { CaptchaService } from '@captcha/captcha.service'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { EmailCaptchaDTO } from './dtos/emailCaptcha.dto'

@Controller('auth')
export class AuthController extends BaseModule implements IAuthController {
  constructor(private readonly captchaService: CaptchaService) {
    super()
  }

  @Get('login/captcha/svg')
  async loginBySvgCaptcha() {
    const VO = await this.captchaService.generateSvgCaptcha('login')
    return VO
  }

  @Post('login/captcha/email')
  async loginByEmailCaptcha(@Body() EmailCaptchaDTO: EmailCaptchaDTO) {
    const VO = await this.captchaService.generateEmailCaptcha(EmailCaptchaDTO.email, '登录验证码', 'Login', 'login')
    return VO
  }
}
