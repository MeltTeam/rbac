import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { PERMISSION_CODE, PERMISSION_CODE_MAX, PERMISSION_CODE_MIN } from '../permission.constant'

@ApiModel(
  {
    permissionCode: {
      type: String,
      description: PERMISSION_CODE,
      minLength: PERMISSION_CODE_MIN,
      maxLength: PERMISSION_CODE_MAX,
      example: PERMISSION_CODE,
    },
  },
  { description: PERMISSION_CODE },
)
export class PermissionCodeDTO {
  @NotEmpty(PERMISSION_CODE)
  @InputSpace(PERMISSION_CODE)
  @InputStringLength(PERMISSION_CODE_MIN, PERMISSION_CODE_MAX, PERMISSION_CODE)
  permissionCode: string
}
