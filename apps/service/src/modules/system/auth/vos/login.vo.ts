import { UserEntity } from '@/modules/system/user/entities/user.entity'

export class UserInfo {
  id: string
  name: string
  loginIp: string
  loginAt: Date

  constructor({ id, name, loginIp, loginAt }: UserEntity) {
    this.id = id
    this.name = name
    this.loginIp = loginIp!
    this.loginAt = loginAt!
  }
}
export class LoginVO {
  userInfo: UserInfo
  accessToken: string
  refreshToken: string
}
