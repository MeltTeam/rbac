import type { IParamsIdDTO } from '@packages/types'
import { UUID_V4_LENGTH } from '@constants/index'
import { InputLength, InputSpace, NotEmpty } from '@decorators/index'
import { USER_ID } from '../user.constant'

export class DelIdDTO implements IParamsIdDTO {
  @InputLength(UUID_V4_LENGTH, UUID_V4_LENGTH, USER_ID)
  @InputSpace(USER_ID)
  @NotEmpty(USER_ID)
  id: string
}
