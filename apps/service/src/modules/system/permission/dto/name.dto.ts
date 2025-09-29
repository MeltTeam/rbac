import type { INameDTO } from '@packages/types'
import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { PERMISSION_NAME, PERMISSION_NAME_MAX, PERMISSION_NAME_MIN } from '../permission.constant'

@ApiModel(
  {
    name: { type: String, description: PERMISSION_NAME, minLength: PERMISSION_NAME_MIN, maxLength: PERMISSION_NAME_MAX, example: PERMISSION_NAME },
  },
  { description: PERMISSION_NAME },
)
export class PermissionNameDTO implements INameDTO {
  @NotEmpty(PERMISSION_NAME)
  @InputSpace(PERMISSION_NAME)
  @InputStringLength(PERMISSION_NAME_MIN, PERMISSION_NAME_MAX, PERMISSION_NAME)
  name: string
}
