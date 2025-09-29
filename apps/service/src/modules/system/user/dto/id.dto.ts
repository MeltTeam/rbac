import { UUID_V4_LENGTH } from '@/common/constants'
import { ApiModel } from '@/common/decorators'
import { IdDTO } from '@/common/dto'
import { USER_ID } from '../user.constant'

@ApiModel(
  {
    id: { type: String, description: USER_ID, minLength: UUID_V4_LENGTH, maxLength: UUID_V4_LENGTH, example: 'xxx' },
  },
  { description: USER_ID },
)
export class UserIdDTO extends IdDTO {}
