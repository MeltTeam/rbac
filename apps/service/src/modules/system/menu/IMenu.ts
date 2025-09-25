import type { CheckEnum, MenuTypeEnum } from '@packages/types'
import type { MenuEntity } from './entities/menu.entity'
import type { MenuTreeEntity } from './entities/menuTree.entity'
import type { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'

/** 菜单表实体接口 */
export interface IMenuEntity {
  /** 父菜单ID */
  parentId: string | null
  /** 菜单名 */
  name: string
  /** 菜单编码 */
  menuCode: string
  /** 菜单路径 */
  path: string
  /** 路由参数 */
  query: string | null
  /** 组件路径 */
  component: string | null
  /** 路由名称 */
  routeName: string | null
  /** 图标地址 */
  icon: string
  /** 是否缓存 */
  isCache: CheckEnum
  /** 是否隐藏 */
  isVisible: CheckEnum
  /** 菜单类型 */
  menuType: MenuTypeEnum
  /** 菜单N-N权限 */
  permissions: PermissionEntity[]
  /** 菜单N-1菜单树(所有祖先,depth>0) */
  ancestorNodes: MenuTreeEntity[]
  /** 菜单N-1菜单树(所有后代,depth>0) */
  descendantNodes: MenuTreeEntity[]
}

/** 菜单树表实体接口 */
export interface IMenuTreeEntity {
  /** 祖先菜单ID */
  ancestorId: string
  /** 后代菜单ID */
  descendantId: string
  /** 路径长度(0 表示自己) */
  depth: number
  /** 祖先菜单 */
  ancestorRole: MenuEntity
  /** 后代菜单 */
  descendantRole: MenuEntity
}

/** 菜单模块服务接口 */
export interface IMenuService {}

/** 菜单模块控制器接口 */
export interface IMenuController {}
