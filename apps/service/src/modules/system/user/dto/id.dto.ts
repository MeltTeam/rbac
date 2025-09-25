import { ApiModel } from '@/common/decorators/swagger.decorator'
import { IdDTO } from '@/common/dto'
import { USER_ID } from '../user.constant'

@ApiModel(
  {
    id: { type: String, description: USER_ID },
  },
  { description: USER_ID },
)
export class UserIdDTO extends IdDTO {}
