import { ApiModel } from '@/common/decorators/swagger.decorator'
import { IdDTO } from '@/common/dto'
import { ROLE_ID } from '../role.constant'

@ApiModel(
  {
    id: { type: String, description: ROLE_ID },
  },
  { description: ROLE_ID },
)
export class RoleIdDTO extends IdDTO {}
