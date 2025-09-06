import type { IRefreshTokenDto } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REFRESH_TOKEN } from '@/common/constants'
import { InputJWT, InputSpace, NotEmpty } from '@/common/decorators'

export class RefreshTokenDto implements IRefreshTokenDto {
  @NotEmpty(REFRESH_TOKEN)
  @InputSpace(REFRESH_TOKEN)
  @InputJWT(REFRESH_TOKEN)
  @IsOptional()
  refreshToken?: string
}
