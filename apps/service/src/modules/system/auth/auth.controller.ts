import type { Request, Response } from 'express'
import type { IAuthController } from './IAuth'
import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators/swagger.decorator'
import { LocalGuard } from '@/common/guards/local.guard'
import { SEND_EMAIL_CAPTCHA_VO } from '@/infrastructure/captcha/captcha.constant'
import { CaptchaService } from '@/infrastructure/captcha/captcha.service'
import { SvgCaptchaVO } from '@/infrastructure/captcha/vo/svgCaptcha.vo'
import { LOGOUT_VO, REGISTER_VO, RESET_PWD_VO } from './auth.constant'
import { AuthService } from './auth.service'
import { EmailCaptchaDTO, LoginByEmailDTO, LoginBySvgDTO, LogoutDTO, RefreshTokenDTO, RegisterByEmailDTO, ResetPwdByEmailDTO } from './dto'
import { LoginVO } from './vo'

@Controller('auth')
@ApiController({ ApiTagsOptions: ['认证模块'] })
export class AuthController implements IAuthController {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly authService: AuthService,
  ) {}

  @Get('login/svg/captcha')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '图片验证码(登录)' }],
    ApiResponseOptions: [{ type: SvgCaptchaVO }],
  })
  async loginBySvgCaptcha() {
    return await this.captchaService.generateSvgCaptcha('login')
  }

  @Post('login/email/captcha')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱验证码(登录)' }],
    ApiResponseOptions: [{ type: String, example: SEND_EMAIL_CAPTCHA_VO }],
  })
  async loginByEmailCaptcha(@Body() emailCaptchaDTO: EmailCaptchaDTO) {
    return await this.captchaService.generateEmailCaptcha({ to: emailCaptchaDTO.email, subject: '登录验证码', type: 'login', template: 'Login' })
  }

  @UseGuards(LocalGuard)
  @Post('login/email')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱登录' }],
    ApiResponseOptions: [{ type: LoginVO }],
  })
  async loginByEmail(@Res({ passthrough: true }) response: Response, @Body() loginByEmailDTO: LoginByEmailDTO) {
    return await this.authService.loginByEmail(response, loginByEmailDTO)
  }

  @UseGuards(LocalGuard)
  @Post('login/svg')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '图片验证码登录' }],
    ApiResponseOptions: [{ type: LoginVO }],
  })
  async loginBySvg(@Res({ passthrough: true }) response: Response, @Body() loginBySvgDTO: LoginBySvgDTO) {
    return await this.authService.loginBySvg(response, loginBySvgDTO)
  }

  @Post('register/email/captcha')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱验证码(注册)' }],
    ApiResponseOptions: [{ type: String, example: SEND_EMAIL_CAPTCHA_VO }],
  })
  async registerByEmailCaptcha(@Body() emailCaptchaDTO: EmailCaptchaDTO) {
    return await this.captchaService.generateEmailCaptcha({
      to: emailCaptchaDTO.email,
      subject: '注册验证码',
      type: 'register',
      template: 'Register',
    })
  }

  @Post('register/email')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '注册用户' }],
    ApiResponseOptions: [{ type: String, example: REGISTER_VO }],
  })
  async registerByEmail(@Body() registerByEmailDTO: RegisterByEmailDTO) {
    await this.authService.registerByEmail(registerByEmailDTO)
    return REGISTER_VO
  }

  @Post('pwd/email/captcha')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '邮箱验证码(重置密码)' }],
    ApiResponseOptions: [{ type: String, example: SEND_EMAIL_CAPTCHA_VO }],
  })
  async resetPwdByEmailCaptcha(@Body() emailCaptchaDTO: EmailCaptchaDTO) {
    return await this.captchaService.generateEmailCaptcha({
      to: emailCaptchaDTO.email,
      subject: '重置密码验证码',
      type: 'resetPwd',
      template: 'ResetPwd',
    })
  }

  @Patch('pwd')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '重置密码' }],
    ApiResponseOptions: [{ type: String, example: RESET_PWD_VO }],
  })
  async resetPwdByEmail(@Res({ passthrough: true }) response: Response, @Body() resetPwdByEmailDTO: ResetPwdByEmailDTO) {
    await this.authService.resetPwdByEmail(response, resetPwdByEmailDTO)
    return RESET_PWD_VO
  }

  @Post('logout')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '退出登录' }],
    ApiResponseOptions: [{ type: String, example: LOGOUT_VO }],
  })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() logoutDTO: LogoutDTO) {
    await this.authService.logout(request, response, logoutDTO)
    return LOGOUT_VO
  }

  @Post('refresh')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '刷新令牌' }],
    ApiResponseOptions: [{ type: LoginVO }],
  })
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() refreshTokenDTO: RefreshTokenDTO) {
    return await this.authService.refresh(request, response, refreshTokenDTO)
  }
}
