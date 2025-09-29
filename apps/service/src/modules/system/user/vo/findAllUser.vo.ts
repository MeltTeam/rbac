import type { IFindAllUserVO } from '@packages/types'
import { ApiModel } from '@/common/decorators'
import { FindAllVO } from '@/common/vo/index.vo'
import { UserVO } from './index'

@ApiModel(
  {
    data: { description: '用户详情列表', type: () => UserVO, isArray: true },
    total: { description: '总数', type: Number },
    page: { description: '第几页', type: Number },
    limit: { description: '一页几条数据', type: Number },
    totalPages: { description: '总页数', type: Number },
  },
  { description: '分页查询用户详情列表' },
)
export class FindAllUserVO extends FindAllVO<UserVO> implements IFindAllUserVO {}
