import type { IRefreshTokenDto } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REFRESH_TOKEN } from '@/common/constants'
import { InputJWT, InputSpace, NotEmpty } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'

@ApiModel(
  {
    refreshToken: { type: String, description: REFRESH_TOKEN, required: false },
  },
  { description: '刷新令牌接口参数校验' },
)
export class RefreshTokenDTO implements IRefreshTokenDto {
  @NotEmpty(REFRESH_TOKEN)
  @InputSpace(REFRESH_TOKEN)
  @InputJWT(REFRESH_TOKEN)
  @IsOptional()
  refreshToken?: string
}
