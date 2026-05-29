import type { CheckEnum, MenuTypeEnum } from '../enums'
import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'

/** 菜单详情 */
export interface IMenuDetailsVO extends ICommonVO {
  /** 父菜单ID */
  parentId: string | null
  /** 菜单名 */
  name: string
  /** 菜单编码(菜单类型:领域:操作类型) */
  menuCode: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType: MenuTypeEnum
  /** 菜单领域 */
  domain: string
  /** 菜单操作类型 */
  action: string
  /** 访问路径(MENU,DIRECTORY,LINK,INNER_LINK) */
  path: string | null
  /** 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  alias: string | null
  /** 组件路径 */
  component: string
  /** 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  redirect: string | null
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON)  */
  query: string | null
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title: string | null
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon: string | null
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache: CheckEnum
  /** 是否隐藏(MENU) */
  isVisible: CheckEnum
  /** 是否刷新(MENU) */
  isRefresh: CheckEnum
}
/** 菜单路由元数据 */
export interface IMenuRouteMetaVO {
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title?: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon?: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache: boolean
  /** 是否隐藏(MENU) */
  isVisible: boolean
  /** 是否刷新(MENU) */
  isRefresh: boolean
  /** 菜单编码 */
  code: string
}
/** 菜单路由 */
export interface IMenuRouteVO {
  /** 路由名 */
  name?: string
  /** 路径(MENU,DIRECTORY,LINK,INNER_LINK) */
  path: string
  /** 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  alias?: string
  /** 组件路径 */
  component: string
  /** 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  redirect?: string
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON)  */
  query?: string
  /** 元数据 */
  meta: IMenuRouteMetaVO
  /** 子菜单列表 */
  children?: IMenuRouteVO[]
}

/** 分页查询菜单详情列表 */
export interface IFindAllMenuVO extends IFindAllVO<IMenuDetailsVO> {}

/** 菜单ID列表 */
export interface IMenuIdsVO extends IIdsVO {}
