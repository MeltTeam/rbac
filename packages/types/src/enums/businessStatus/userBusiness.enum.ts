import { HttpStatus } from '../httpStatus.enum'
/** 用户模块业务码枚举 */
export enum UserBusiness {
  /** 用户未找到 */
  NOT_FOUND = '4100',
  /** 用户名已存在 */
  NAME_ALREADY_EXISTS = '4101',
  /** 邮箱已存在 */
  EMAIL_ALREADY_EXISTS = '4102',
  /** 电话号码已存在 */
  PHONE_ALREADY_EXISTS = '4103',
  /** 角色未找到 */
  ROLE_NOT_FOUND = '4104',
  /** 不能删除内置用户 */
  CANNOT_DELETE_BUILT_IN_USER = '4105',
}

/** 用户模块业务码文本映射 */
export const UserBusinessTextMap: Record<UserBusiness, [string, number]> = {
  [UserBusiness.NOT_FOUND]: ['用户未找到', HttpStatus.NOT_FOUND],
  [UserBusiness.NAME_ALREADY_EXISTS]: ['用户名已存在', HttpStatus.CONFLICT],
  [UserBusiness.EMAIL_ALREADY_EXISTS]: ['邮箱已存在', HttpStatus.CONFLICT],
  [UserBusiness.PHONE_ALREADY_EXISTS]: ['电话号码已存在', HttpStatus.CONFLICT],
  [UserBusiness.ROLE_NOT_FOUND]: ['角色未找到', HttpStatus.NOT_FOUND],
  [UserBusiness.CANNOT_DELETE_BUILT_IN_USER]: ['不能删除内置用户', HttpStatus.FORBIDDEN],
}
