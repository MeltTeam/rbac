import type { CreateRoleDTO } from './dto'
import type { RoleEntity } from './entities/role.entity'
import type { RoleTreeEntity } from './entities/roleTree.entity'
import type { RoleVO } from './vo'
// import type { CheckEnum, DataScopeEnum, SortOrderEnum } from '@packages/types'
import type { ICommonEntity } from '@/common/entities/ICommonEntity'
import type { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import type { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import type { UserEntity } from '@/modules/system/user/entities/user.entity'

/** 角色表实体接口 */
export interface IRoleEntity extends ICommonEntity {
  /** 父角色ID */
  parentId: string | null
  /** 角色名 */
  name: string
  /** 角色编码 */
  code: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  // sortOrder: SortOrderEnum
  /** 数据权限范围(10:全部数据权限 20:自定义数据权限 30:本部门数据权限 40:本部门及以下数据权限 50:仅本人数据权限 默认:50) */
  // dataScope: DataScopeEnum
  /** 部门树是否关联显示(10:是 20:否 默认:10) */
  // deptTreeCheckStrictly: CheckEnum
  /** 权限树是否关联显示(10:是 20:否 默认:10) */
  // permissionsTreeCheckStrictly: CheckEnum

  /** 角色N-N用户 */
  users: UserEntity[]
  /** 角色N-N权限 */
  permissions: PermissionEntity[]
  /** 角色N-N部门 */
  depts: DeptEntity[]
  /** 角色N-1角色树(所有祖先,depth>0) */
  ancestorNodes: RoleTreeEntity[]
  /** 角色N-1角色树(所有后代,depth>0) */
  descendantNodes: RoleTreeEntity[]
}

/** 角色树表实体接口 */
export interface IRoleTreeEntity {
  /** 祖先角色ID */
  ancestorId: string
  /** 后代角色ID */
  descendantId: string
  /** 路径长度(0 表示自己) */
  depth: number
  /** 祖先角色 */
  ancestorRole: RoleEntity
  /** 后代角色 */
  descendantRole: RoleEntity
}

/** 角色模块服务接口 */
export interface IRoleService {
  /**
   * 创建角色
   * @param createRoleDTO 创建参数
   * @param by 操作者，默认sys
   */
  create: (createRoleDTO: CreateRoleDTO, by?: string) => Promise<RoleVO>
}

/** 角色模块控制器接口 */
export interface IRoleController {
  /**
   * 创建角色接口
   * @param createRoleDTO 创建参数
   */
  create: (createRoleDTO: CreateRoleDTO) => Promise<RoleVO>
}
