import type { INameDTO } from '@packages/types'
import { InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { ROLE_NAME, ROLE_NAME_MAX, ROLE_NAME_MIN } from '../role.constant'

@ApiModel(
  {
    name: { type: String, description: ROLE_NAME },
  },
  { description: ROLE_NAME },
)
export class RoleNameDTO implements INameDTO {
  @NotEmpty(ROLE_NAME)
  @InputSpace(ROLE_NAME)
  @InputStringLength(ROLE_NAME_MIN, ROLE_NAME_MAX, ROLE_NAME)
  name: string
}
