import type { DeptEntity } from '@dept/entities/dept.entity'
import type { CheckEnum, DataScopeEnum, SortOrderEnum } from '@packages/types'
import type { PermissionEntity } from '@permission/entities/permission.entity'
import type { UserEntity } from '@user/entities/user.entity'

/** 角色表实体接口 */
export interface IRoleEntity {
  /** 角色名 */
  name: string
  /** 角色编码 */
  code: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  sortOrder: SortOrderEnum
  /** 数据权限范围(10:全部数据权限 20:自定义数据权限 30:本部门数据权限 40:本部门及以下数据权限 50:仅本人数据权限 默认:50) */
  dataScope: DataScopeEnum
  /** 部门树是否关联显示(10:是 20:否 默认:10) */
  deptTreeCheckStrictly: CheckEnum
  /** 权限树是否关联显示(10:是 20:否 默认:10) */
  permissionsTreeCheckStrictly: CheckEnum

  /** 角色1-N用户 */
  users: UserEntity[]
  /** 角色1-N权限 */
  permissions: PermissionEntity[]
  /** 角色1-N部门 */
  depts: DeptEntity[]
}
