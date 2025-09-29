import { UUID_V4_LENGTH } from '@/common/constants'
import { ApiModel } from '@/common/decorators'
import { IdDTO } from '@/common/dto'
import { PERMISSION_ID } from '../permission.constant'

@ApiModel(
  {
    id: { type: String, description: PERMISSION_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: PERMISSION_ID },
  },
  { description: PERMISSION_ID },
)
export class PermissionIdDTO extends IdDTO {}
