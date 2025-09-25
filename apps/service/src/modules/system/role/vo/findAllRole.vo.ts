import type { IFindAllRoleVO } from '@packages/types'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { FindAllVO } from '@/common/vo/index.vo'
import { RoleVO } from './index'

@ApiModel(
  {
    data: { description: '角色详情列表', type: () => RoleVO, isArray: true },
    total: { description: '总数', type: Number },
    page: { description: '第几页', type: Number },
    limit: { description: '一页几条数据', type: Number },
    totalPages: { description: '总页数', type: Number },
  },
  { description: '分页查询角色详情列表' },
)
export class FindAllRoleVO extends FindAllVO<RoleVO> implements IFindAllRoleVO {}
