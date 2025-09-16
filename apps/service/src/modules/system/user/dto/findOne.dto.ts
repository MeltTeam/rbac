import { ApiModel } from '@/common/decorators/swagger.decorator'
import { USER_ID } from '../user.constant'
import { DelIdDTO } from './del.dto'

@ApiModel({
  id: { type: String, description: USER_ID },
})
export class FindOneIdDTO extends DelIdDTO {}
