import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  clsService: ClsService

  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'name', passwordField: 'pwd' })
  }

  async validate(name: string, pwd: string) {
    const ip = this.clsService.get('CLIENT_IP')
    const userInfo = await this.authService.validateUser({ name, pwd, ip })
    return userInfo
  }
}
