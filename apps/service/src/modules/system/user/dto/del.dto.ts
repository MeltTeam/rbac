import type { IParamsIdDTO } from '@packages/types'
import { UUID_V4_LENGTH } from '@constants/index'
import { InputSpace, InputStringLength, NotEmpty } from '@decorators/index'
import { USER_ID } from '../user.constant'

export class DelIdDTO implements IParamsIdDTO {
  @NotEmpty(USER_ID)
  @InputSpace(USER_ID)
  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, USER_ID)
  id: string
}
