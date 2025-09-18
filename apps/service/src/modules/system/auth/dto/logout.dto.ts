import { REFRESH_TOKEN } from '@/common/constants'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { RefreshTokenDTO } from './refreshToken.dto'

@ApiModel(
  {
    refreshToken: { type: String, description: REFRESH_TOKEN },
  },
  { description: '退出登录接口参数校验' },
)
export class LogoutDTO extends RefreshTokenDTO {}
