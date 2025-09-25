import type { MenuEntity } from '@/modules/system/menu/entities/menu.entity'
import type { RoleEntity } from '@/modules/system/role/entities/role.entity'

/** 权限表实体接口 */
export interface IPermissionEntity {
  /** 权限名 */
  name: string
  /** 权限编码(领域名:操作名) */
  permissionCode: string
  /** 领域名 */
  domain: string
  /** 操作名 */
  action: string
  /** 权限N-N角色 */
  roles: RoleEntity[]
  /** 权限N-N菜单 */
  menus: MenuEntity[]
}

/** 权限模块服务接口 */
export interface IPermissionService {}

/** 权限模块控制器接口 */
export interface IPermissionController {}
