import type { SortOrderEnum } from '@packages/types'
import type { RoleEntity } from '@role/entities/role.entity'

/** 部门表实体接口 */
export interface IDeptEntity {
  /** 部门名 */
  name: string
  /** 父级部门ID */
  parentId: string
  /** 祖级列表(描述当前节点到根节点的ID列表，用逗号分隔,用于构建树形结构优化) */
  ancestors: string
  /** 部门负责人ID */
  leaderId: string
  /** 部门邮箱 */
  email?: string | null
  /** 部门电话 */
  phone?: string | null
  /** 部门编码 */
  code: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  sortOrder: SortOrderEnum

  /** 部门N-1角色 */
  role: RoleEntity
}
