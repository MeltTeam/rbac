import type { ILogoutDTO } from '@packages/types'
import { ApiModel } from '@/common/decorators'
import { REFRESH_TOKEN } from '../auth.constant'
import { RefreshTokenDTO } from './refreshToken.dto'

@ApiModel(
  {
    refreshToken: { type: String, description: REFRESH_TOKEN },
  },
  { description: '退出登录接口参数校验' },
)
export class LogoutDTO extends RefreshTokenDTO implements ILogoutDTO {}
