import { HttpStatus } from '../httpStatus.enum'
/** 权限模块业务码枚举 */
export enum PermissionBusiness {
  /** 权限未找到 */
  NOT_FOUND = '4400',
  /** 权限名已存在 */
  NAME_ALREADY_EXISTS = '4401',
  /** 权限编码已存在 */
  CODE_ALREADY_EXISTS = '4402',
  /** 不能删除内置权限 */
  CANNOT_DELETE_BUILT_IN_PERMISSION = '4403',
}

/** 权限模块业务码文本映射 */
export const PermissionBusinessTextMap: Record<PermissionBusiness, [string, number]> = {
  [PermissionBusiness.NOT_FOUND]: ['权限未找到', HttpStatus.NOT_FOUND],
  [PermissionBusiness.NAME_ALREADY_EXISTS]: ['权限名已存在', HttpStatus.CONFLICT],
  [PermissionBusiness.CODE_ALREADY_EXISTS]: ['权限编码已存在', HttpStatus.CONFLICT],
  [PermissionBusiness.CANNOT_DELETE_BUILT_IN_PERMISSION]: ['不能删除内置权限', HttpStatus.FORBIDDEN],
}
