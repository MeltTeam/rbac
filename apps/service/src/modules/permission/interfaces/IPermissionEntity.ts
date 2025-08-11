import type { CheckEnum, PermissionTypeEnum, SortOrderEnum } from '@packages/types'
import type { RoleEntity } from '@/modules/role/entities/role.entity'

/** 权限表实体接口 */
export interface IPermissionEntity {
  /** 权限名 */
  name: string
  /** 父级权限ID */
  parentId: string
  /** 祖级列表(描述当前节点到根节点的ID列表，用逗号分隔,用于构建树形结构优化) */
  ancestors: string
  /** 权限编码 */
  code: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  sortOrder: SortOrderEnum
  /** 访问地址(访问权限的URL,除了按钮类型) */
  path: string
  /** 路由参数(访问权限的URL后加的参数,除了按钮类型) */
  query: string
  /** 路由名称(菜单类型特有) */
  routeName: string
  /** 组件路径(菜单类型特有) */
  component: string
  /** 图标地址(菜单类型特有) */
  icon: string
  /** 是否为外链(菜单类型特有)(10:是 20:否 默认:20) */
  isFrame: CheckEnum
  /** 是否缓存(菜单类型特有)(10:是 20:否 默认:20) */
  isCache: CheckEnum
  /** 是否隐藏(菜单类型特有)(10:是 20:否 默认:20) */
  isVisible: CheckEnum
  /** 权限类型(10:菜单 20:按钮 30:接口 40:目录 默认:10) */
  type: PermissionTypeEnum

  /** 权限N-1角色 */
  role: RoleEntity
}
