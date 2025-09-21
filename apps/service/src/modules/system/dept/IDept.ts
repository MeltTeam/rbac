import type { DeptEntity } from './entities/dept.entity'
import type { DeptTreeEntity } from './entities/deptTree.entity'
import type { DeptVO } from './vo'
import type { ICommonEntity } from '@/common/entities/ICommonEntity'
import type { PostEntity } from '@/modules/system/post/entities/post.entity'
import type { RoleEntity } from '@/modules/system/role/entities/role.entity'

/** 部门表实体接口 */
export interface IDeptEntity extends ICommonEntity {
  /** 部门名 */
  name: string
  /** 父级部门ID */
  parentId: string | null
  /** 祖级列表(描述当前节点到根节点的ID列表，用逗号分隔,用于构建树形结构优化) */
  // ancestors: string
  /** 部门负责人ID */
  leaderId: string
  /** 部门邮箱 */
  email: string | null
  /** 部门电话 */
  phone: string | null
  /** 部门编码 */
  code: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  // sortOrder: SortOrderEnum

  /** 部门1-N岗位 */
  posts: PostEntity[]
  /** 部门N-N角色 */
  roles: RoleEntity[]
  /** 角色N-1部门树(所有祖先,depth>0) */
  ancestorNodes: DeptTreeEntity[]
  /** 角色N-1部门树(所有后代,depth>0) */
  descendantNodes: DeptTreeEntity[]
}

/** 部门树表实体接口 */
export interface IDeptTreeEntity {
  /** 祖先部门ID */
  ancestorId: string
  /** 后代部门ID */
  descendantId: string
  /** 路径长度(0 表示自己) */
  depth: number
  /** 祖先部门 */
  ancestorDept: DeptEntity
  /** 后代部门 */
  descendantDept: DeptEntity
}

export interface IDeptController {
  create: () => Promise<DeptVO>
}

export interface IDeptService {
  create: () => Promise<DeptVO>
}
