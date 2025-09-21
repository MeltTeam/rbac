import type { Request, Response } from 'express'
import type { LoginByEmailDTO, LoginBySvgDTO, LogoutDTO, RefreshTokenDTO, RegisterByEmailDTO, ResetPwdByEmailDTO } from './dto'
import type { IAuthService } from './IAuth'
import type { JwtConfigType } from '@/configs'
import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthBusiness } from '@packages/types'
import { ClsService } from 'nestjs-cls'
import { JWT_CONFIG_KEY } from '@/configs'
import { CaptchaService } from '@/infrastructure/captcha/captcha.service'
import { TokenType } from '@/infrastructure/jwt2/jwt2.constant'
import { Jwt2Service } from '@/infrastructure/jwt2/jwt2.service'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { UserService } from '@/modules/system/user/user.service'
import { AuthException } from './auth.util'
import { LoginVO, UserInfo } from './vo'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly captchaService: CaptchaService,
    private readonly clsService: ClsService<ILoggerCls>,
    private readonly jwt2Service: Jwt2Service,
    private readonly configService: ConfigService,
  ) {}

  async registerByEmail(registerByEmailDTO: RegisterByEmailDTO) {
    const { name, email, captcha, pwd } = registerByEmailDTO
    await this.captchaService.verifyCaptcha(captcha, { id: email, type: 'register', name: 'email' })
    await this.userService.create({ name, pwd, email, remark: '由邮箱注册' })
    return true
  }

  async resetPwdByEmail(response: Response, resetPwdByEmailDTO: ResetPwdByEmailDTO) {
    const { name, email, captcha, pwd } = resetPwdByEmailDTO
    await this.captchaService.verifyCaptcha(captcha, { id: email, type: 'resetPwd', name: 'email' })
    const user = await this.userService.findOneByName({ name })
    if (email !== user?.profile.email) throw new AuthException(AuthBusiness.EMAIL_MISMATCH)
    await this.userService.updatePwd(user.id, pwd)
    await this.delAllToken(user.id, response)
    return true
  }

  async loginByEmail(response: Response, loginByEmailDTO: LoginByEmailDTO) {
    const { email, captcha } = loginByEmailDTO
    await this.captchaService.verifyCaptcha(captcha, { id: email, type: 'login', name: 'email' })
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    if (email !== userInfo.email) throw new AuthException(AuthBusiness.EMAIL_MISMATCH)
    await this.userService.updateLoginInfo(userInfo.id, userInfo.loginAt!, userInfo.loginIp!)
    return await this.setAllToken(response)
  }

  async loginBySvg(response: Response, loginBySvgDTO: LoginBySvgDTO) {
    const { captcha, token } = loginBySvgDTO
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    await this.captchaService.verifyCaptcha(captcha, { id: token, type: 'login', name: 'svg' })
    await this.userService.updateLoginInfo(userInfo.id, userInfo.loginAt!, userInfo.loginIp!)
    return await this.setAllToken(response)
  }

  async setAllToken(response: Response) {
    const {
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      accessTokenCookieExpiresIn,
      refreshTokenCookieExpiresIn,
      serviceConfig: { secret },
    } = this.configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt2Service.generateToken(userInfo, accessTokenExpiresIn, secret as string, TokenType.ACCESS_TOKEN),
      this.jwt2Service.generateToken(userInfo, refreshTokenExpiresIn, secret as string, TokenType.REFRESH_TOKEN),
    ])
    await this.jwt2Service.setRedisToken({ userId: userInfo.id, refreshToken, accessToken, ttl: refreshTokenCookieExpiresIn })
    await Promise.all([
      this.jwt2Service.setCookieToken(response, TokenType.ACCESS_TOKEN, accessToken, accessTokenCookieExpiresIn),
      this.jwt2Service.setCookieToken(response, TokenType.REFRESH_TOKEN, refreshToken, refreshTokenCookieExpiresIn),
    ])
    const VO = new LoginVO({ accessToken, refreshToken })
    return VO
  }

  async logout(request: Request, response: Response, logoutDTO: LogoutDTO) {
    const _refreshToken = logoutDTO.refreshToken ?? request.cookies[TokenType.REFRESH_TOKEN]
    const {
      serviceConfig: { secret },
    } = this.configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
    const payload = await this.jwt2Service.validateToken(_refreshToken, secret)
    if (payload.tokenType !== TokenType.REFRESH_TOKEN) throw new UnauthorizedException()
    return await this.delAllToken(payload.id, response)
  }

  async refresh(request: Request, response: Response, refreshTokenDTO: RefreshTokenDTO) {
    const _refreshToken = refreshTokenDTO?.refreshToken ?? request.cookies[TokenType.REFRESH_TOKEN]
    const {
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      accessTokenCookieExpiresIn,
      refreshTokenCookieExpiresIn,
      serviceConfig: { secret },
    } = this.configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
    const payload = await this.jwt2Service.validateToken(_refreshToken, secret)
    const { tokenType, iat, exp, ...userInfo } = payload
    if (tokenType !== TokenType.REFRESH_TOKEN) throw new UnauthorizedException()

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt2Service.generateToken(userInfo, accessTokenExpiresIn, secret as string, TokenType.ACCESS_TOKEN),
      this.jwt2Service.generateToken(userInfo, refreshTokenExpiresIn, secret as string, TokenType.REFRESH_TOKEN),
    ])
    await this.jwt2Service.setRedisToken({ userId: userInfo.id, refreshToken, accessToken, ttl: refreshTokenCookieExpiresIn })
    await Promise.all([
      this.jwt2Service.setCookieToken(response, TokenType.ACCESS_TOKEN, accessToken, accessTokenCookieExpiresIn),
      this.jwt2Service.setCookieToken(response, TokenType.REFRESH_TOKEN, refreshToken, refreshTokenCookieExpiresIn),
    ])
    const VO = new LoginVO({ accessToken, refreshToken })
    return VO
  }

  async delAllToken(id: string, response: Response) {
    await this.jwt2Service.delRedisToken(id)
    await Promise.all([
      this.jwt2Service.delCookieToken(response, TokenType.ACCESS_TOKEN),
      this.jwt2Service.delCookieToken(response, TokenType.REFRESH_TOKEN),
    ])
    return true
  }

  async validateUser(name: string, pwd: string) {
    const ip = this.clsService.get(LOGGER_CLS.CLIENT_IP)
    const user = await this.userService.findOneByName({ name }, false)
    if (!user) throw new AuthException(AuthBusiness.USER_NOT_FOUND)
    const compare = await this.userService.compare(pwd, user.salt, user.pwd)
    if (!compare) throw new AuthException(AuthBusiness.INCORRECT_PASSWORD)
    const now = new Date()
    const VO = new UserInfo({ id: user.id, name: user.name, email: user.profile.email, loginIp: ip, loginAt: now })
    return VO
  }
}
