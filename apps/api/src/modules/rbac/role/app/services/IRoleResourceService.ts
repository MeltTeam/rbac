import type { IIdsDTO, IReplaceRolesResourceDTO } from '@packages/types'
import type { EntityManager } from 'typeorm'
import type { IRoleEntity } from '../../domain'
import type { IResourceEntity } from '@/modules/rbac/resource/domain'

/** 角色资源服务接口 */
export interface IRoleResourceService {
  /** 批量替换角色的资源(全量替换) */
  replaceRolesResourceByIds: (em: EntityManager, replaceRolesResourceDTO: IReplaceRolesResourceDTO, by?: string) => Promise<IRoleEntity[]>
  /** 获取多个角色ID的资源ID列表 */
  getResourceIdsByRoleIds: (roleIds: IIdsDTO, em?: EntityManager) => Promise<IRoleEntity[]>
  /** 获取多个资源ID的角色ID列表 */
  getRoleIdsByResourceIds: (resourceIds: IIdsDTO, em?: EntityManager) => Promise<IResourceEntity[]>
}
