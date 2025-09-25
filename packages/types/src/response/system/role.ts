import type { StatusEnum } from '../../enums'
import type { IFindAllVO } from '../common'
import type { IDeptVO } from './dept'
import type { IPermissionVo } from './permission'

/** 角色详情 */
export interface IRoleVO {
  /** 业务ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 备注 */
  remark: string | null
  /** 状态 */
  status: StatusEnum
  /** 父角色ID */
  parentId: string | null
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 拥有权限列表 */
  permissions: IPermissionVo[]
  /** 拥有部门列表 */
  depts: IDeptVO[]
}

/** 分页查询角色详情列表 */
export interface IFindAllRoleVO extends IFindAllVO<IRoleVO> {}
