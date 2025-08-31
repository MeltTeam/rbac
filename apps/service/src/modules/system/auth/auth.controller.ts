import type { IAuthController } from './IAuth'
import { CaptchaService } from '@captcha/captcha.service'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { EmailCaptchaDTO } from './dtos/emailCaptcha.dto'
import { SvgCaptchaVO } from './vos'

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('login/captcha/svg')
  async loginBySvgCaptcha() {
    const captcha = await this.captchaService.generateSvgCaptcha('login')
    const VO = new SvgCaptchaVO(captcha)
    return VO
  }

  @Post('login/captcha/email')
  async loginByEmailCaptcha(@Body() emailCaptchaDTO: EmailCaptchaDTO) {
    const VO = await this.captchaService.generateEmailCaptcha({
      to: emailCaptchaDTO.email,
      subject: '登录验证码',
      type: 'login',
      template: 'Login',
    })
    return VO
  }
}
