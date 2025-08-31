import type { IRefreshTokenDto } from '@packages/types'
import { REFRESH_TOKEN } from '@constants/index'
import { InputJWT, InputSpace, NotEmpty } from '@decorators/index'
import { IsOptional } from 'class-validator'

export class RefreshTokenDto implements IRefreshTokenDto {
  @NotEmpty(REFRESH_TOKEN)
  @InputSpace(REFRESH_TOKEN)
  @InputJWT(REFRESH_TOKEN)
  @IsOptional()
  refreshToken?: string
}
