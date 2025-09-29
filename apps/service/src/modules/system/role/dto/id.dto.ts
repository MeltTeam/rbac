import { UUID_V4_LENGTH } from '@/common/constants'
import { ApiModel } from '@/common/decorators'
import { IdDTO } from '@/common/dto'
import { ROLE_ID } from '../role.constant'

@ApiModel(
  {
    id: { type: String, description: ROLE_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: ROLE_ID },
  },
  { description: ROLE_ID },
)
export class RoleIdDTO extends IdDTO {}
