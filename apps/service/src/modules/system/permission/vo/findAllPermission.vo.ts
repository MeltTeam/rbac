import type { IFindAllPermissionVO } from '@packages/types'
import { ApiModel } from '@/common/decorators'
import { FindAllVO } from '@/common/vo/index.vo'
import { PermissionVO } from './index'

@ApiModel(
  {
    data: { description: '权限详情列表', type: () => PermissionVO, isArray: true },
    total: { description: '总数', type: Number },
    page: { description: '第几页', type: Number },
    limit: { description: '一页几条数据', type: Number },
    totalPages: { description: '总页数', type: Number },
  },
  { description: '分页查询角色详情列表' },
)
export class FindAllPermissionVO extends FindAllVO<PermissionVO> implements IFindAllPermissionVO {}
