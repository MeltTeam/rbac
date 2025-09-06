import type { IParamsIdDTO } from '@packages/types'
import { UUID_V4_LENGTH } from '@/common/constants'
import { InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { USER_ID } from '../user.constant'

export class DelIdDTO implements IParamsIdDTO {
  @NotEmpty(USER_ID)
  @InputSpace(USER_ID)
  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, USER_ID)
  id: string
}
