import { HttpStatus } from '../httpStatus.enum'
/** 用户模块业务码枚举 */
export enum UserBusiness {
  /** 用户未找到 */
  NOT_FOUND = '4100',
  /** 用户名已存在 */
  NAME_ALREADY_EXISTS = '4102',
  /** 邮箱已存在 */
  EMAIL_ALREADY_EXISTS = '4103',
  /** 电话号码已存在 */
  PHONE_ALREADY_EXISTS = '4104',
}

/** 用户模块业务码文本映射 */
export const UserBusinessTextMap: Record<UserBusiness, [string, number]> = {
  [UserBusiness.NOT_FOUND]: ['用户未找到', HttpStatus.NOT_FOUND],
  [UserBusiness.NAME_ALREADY_EXISTS]: ['用户名已存在', HttpStatus.CONFLICT],
  [UserBusiness.EMAIL_ALREADY_EXISTS]: ['邮箱已存在', HttpStatus.CONFLICT],
  [UserBusiness.PHONE_ALREADY_EXISTS]: ['电话号码已存在', HttpStatus.CONFLICT],
}
