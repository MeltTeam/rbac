import type { IAuthController } from './IAuth'
import type { CaptchaService } from '@/infrastructure/captcha/captcha.service'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { LocalGuard } from '@/common/guards/local.guard'
import { REGISTER_OK } from './auth.constant'
import { AuthService } from './auth.service'
import { EmailCaptchaDTO } from './dtos/emailCaptcha.dto'
import { LoginByEmailDTO } from './dtos/loginByEmail.dto'
import { RegisterByEmailDTO } from './dtos/registerByEmail.dto'
import { SvgCaptchaVO } from './vos'

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly authService: AuthService,
  ) {}

  @Get('login/svg/captcha')
  async loginBySvgCaptcha() {
    const captcha = await this.captchaService.generateSvgCaptcha('login')
    const VO = new SvgCaptchaVO(captcha)
    return VO
  }

  @Post('login/email/captcha')
  async loginByEmailCaptcha(@Body() emailCaptchaDTO: EmailCaptchaDTO) {
    const VO = await this.captchaService.generateEmailCaptcha({
      to: emailCaptchaDTO.email,
      subject: '登录验证码',
      type: 'login',
      template: 'Login',
    })
    return VO
  }

  @UseGuards(LocalGuard)
  @Post('login/email')
  async loginByEmail(@Body() loginByEmailDTO: LoginByEmailDTO) {
    console.warn(loginByEmailDTO)
    return loginByEmailDTO
  }

  @Post('register/email/captcha')
  async registerByEmailCaptcha(@Body() emailCaptchaDTO: EmailCaptchaDTO) {
    const VO = await this.captchaService.generateEmailCaptcha({
      to: emailCaptchaDTO.email,
      subject: '注册验证码',
      type: 'register',
      template: 'Register',
    })
    return VO
  }

  @Post('register/email')
  async registerByEmail(@Body() registerByEmailDTO: RegisterByEmailDTO) {
    await this.authService.handlerRegisterByEmail(registerByEmailDTO)
    return REGISTER_OK
  }
}
