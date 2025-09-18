import { ApiModel } from '@/common/decorators/swagger.decorator'

@ApiModel(
  {
    id: { type: String, description: '业务ID', example: 'xxx' },
    name: { type: String, description: '用户名', example: 'xxx' },
    loginIp: { type: String, description: '登录IP', example: 'xxx' },
    loginAt: { type: Date, description: '登录时间', example: 'xxx' },
  },
  { description: '用户信息' },
)
export class UserInfo {
  id: string
  name: string
  email: string | null
  loginIp: string | null
  loginAt: Date | null
  constructor(userInfo?: UserInfo) {
    if (userInfo) {
      const { id, name, loginIp, loginAt, email } = userInfo
      this.id = id
      this.name = name
      this.email = email
      this.loginIp = loginIp
      this.loginAt = loginAt
    }
  }
}

@ApiModel(
  {
    accessToken: { type: String, description: '访问令牌', example: 'xxx' },
    refreshToken: { type: String, description: '刷新令牌', example: 'xxx' },
  },
  { description: '登录返回信息' },
)
export class LoginVO {
  accessToken: string
  refreshToken: string
  constructor(login?: LoginVO) {
    if (login) {
      const { accessToken, refreshToken } = login
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    }
  }
}
