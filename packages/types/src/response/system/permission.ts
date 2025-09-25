import type { StatusEnum } from '../../enums'
import type { IFindAllVO } from '../common'

/** 权限详情 */
export interface IPermissionVo {
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
  /** 权限名 */
  name: string
  /** 权限编码 */
  permissionCode: string
}

/** 分页查询权限详情列表 */
export interface IFindAllPermissionVO extends IFindAllVO<IPermissionVo> {}
