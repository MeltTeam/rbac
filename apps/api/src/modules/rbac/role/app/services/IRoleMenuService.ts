import type { IIdsDTO, IReplaceRolesMenuDTO } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { IRoleEntity } from '../../domain'
import type { IMenuEntity } from '@/modules/rbac/menu/domain'

/** 角色菜单服务接口 */
export interface IRoleMenuService {
  /** 批量替换角色的菜单(全量替换) */
  replaceRolesMenuByIds: (em: EntityManager, replaceRolesMenuDTO: IReplaceRolesMenuDTO, by?: string) => Promise<IRoleEntity[]>
  /** 获取多个角色ID的菜单ID列表 */
  getMenuIdsByRoleIds: (roleIds: IIdsDTO, em?: EntityManager) => Promise<IRoleEntity[]>
  /** 获取多个菜单ID的角色ID列表 */
  getRoleIdsByMenuIds: (menuIds: IIdsDTO, em?: EntityManager) => Promise<IMenuEntity[]>
}
