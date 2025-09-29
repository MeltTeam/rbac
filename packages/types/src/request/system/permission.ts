import type { ActionTypeEnum } from '../../enums'

/** 创建权限接口参数校验 */
export interface ICreatePermissionDTO {
  /** 权限名 */
  name: string
  /** 领域 */
  domain: string
  /** 操作类型 */
  actionType: ActionTypeEnum
  /** 备注 */
  remark?: string
}

/** 更新权限接口参数校验 */
export interface IUpdatePermissionDTO {
  /** 权限名 */
  name?: string
  /** 领域 */
  domain?: string
  /** 操作类型 */
  actionType?: ActionTypeEnum
  /** 备注 */
  remark?: string
}
