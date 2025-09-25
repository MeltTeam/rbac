import type { INameDTO } from '@packages/types'
import { InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME },
  },
  { description: USER_NAME },
)
export class UserNameDTO implements INameDTO {
  @NotEmpty(USER_NAME)
  @InputSpace(USER_NAME)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  name: string
}
