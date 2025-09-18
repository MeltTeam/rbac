import { ApiModel } from '@/common/decorators/swagger.decorator'
import { USER_ID } from '../user.constant'
import { DelByIdDTO } from './delById.dto'

@ApiModel({
  id: { type: String, description: USER_ID },
})
export class FindOneByIdDTO extends DelByIdDTO {}
