import type { IAuthController } from './interfaces/IAuthController'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'
import { CaptchaService } from '@/shared/captcha/captcha.service'
import { EmailCaptchaDto } from './dtos'

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
  async loginByEmailCaptcha(@Body() EmailCaptchaDto: EmailCaptchaDto) {
    const VO = await this.captchaService.generateEmailCaptcha(EmailCaptchaDto.email, '登录验证码', 'Login', 'login')
    return VO
  }
}
