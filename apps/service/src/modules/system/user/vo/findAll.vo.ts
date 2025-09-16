import { ApiModel } from '@/common/decorators/swagger.decorator'
import { UserVO } from './index'

@ApiModel(
  {
    data: { type: () => UserVO, isArray: true },
    total: { description: '总数', type: Number },
    page: { description: '第几页', type: Number },
    limit: { description: '一页几条数据', type: Number },
    totalPages: { description: '总页数', type: Number },
  },
  { description: '分页数据' },
)
export class FindAllVO<T = any> {
  data: T[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}
