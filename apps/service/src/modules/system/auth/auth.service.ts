import type { Repository } from 'typeorm'
import type { LoginByEmailDTO } from './dtos/loginByEmail.dto'
import type { RegisterByEmailDTO } from './dtos/registerByEmail.dto'
import type { IAuthService, IValidateUserOptions } from './IAuth'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthBusiness } from '@packages/types'
import { CaptchaService } from '@/infrastructure/captcha/captcha.service'
import { Jwt2Service } from '@/infrastructure/jwt2/jwt2.service'
import { UserEntity } from '@/modules/system/user/entities/user.entity'
import { UserProfileEntity } from '@/modules/system/user/entities/userProfile.entity'
import { UserService } from '@/modules/system/user/user.service'
import { AuthException } from './auth.exception'
import { UserInfo } from './vos'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly userService: UserService,
    private readonly captchaService: CaptchaService,
    private readonly jwt2Service: Jwt2Service,
  ) {}

  async handlerRegisterByEmail(registerByEmailDTO: RegisterByEmailDTO) {
    const { name, email, captcha, pwd } = registerByEmailDTO
    // 验证验证码
    await this.captchaService.verifyCaptcha(captcha, { id: email, type: 'register', name: 'email' })
    await this.userService.handlerAdd({ name, pwd, email, remark: '由邮箱注册' })
    return true
  }

  async handlerLoginByEmail(loginByEmailDTO: LoginByEmailDTO) {
    const { email, captcha } = loginByEmailDTO
    // 验证验证码
    await this.captchaService.verifyCaptcha(captcha, { id: email, type: 'login', name: 'email' })
  }

  async validateUser(options: IValidateUserOptions) {
    const { name, pwd, ip } = options
    const user = await this.userRepository.findOne({ where: { name } })
    if (!user) throw new AuthException(AuthBusiness.USER_NOT_FOUND)
    const compare = await this.userService.compare(pwd, user.salt, user.pwd)
    if (!compare) throw new AuthException(AuthBusiness.INCORRECT_PASSWORD)
    await this.userRepository.update({ name }, { loginAt: new Date(), loginIp: ip })
    const VO = new UserInfo(user)
    return VO
  }
}
