import type { IParamsIdDto } from '@packages/types'
import { USER_ID, UUID_V4_LENGTH } from '@/common/constants'
import { InputLength, InputSpace, NotEmpty } from '@/common/decorators'

export class DelDto implements IParamsIdDto {
  @InputLength(UUID_V4_LENGTH, UUID_V4_LENGTH, USER_ID)
  @InputSpace(USER_ID)
  @NotEmpty(USER_ID)
  id: string
}
