import { InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { ROLE_CODE, ROLE_CODE_MAX, ROLE_CODE_MIN } from '../role.constant'

@ApiModel(
  {
    roleCode: { type: String, description: ROLE_CODE },
  },
  { description: ROLE_CODE },
)
export class RoleCodeDTO {
  @NotEmpty(ROLE_CODE)
  @InputSpace(ROLE_CODE)
  @InputStringLength(ROLE_CODE_MIN, ROLE_CODE_MAX, ROLE_CODE)
  roleCode: string
}
