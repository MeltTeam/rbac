import { HttpStatus } from '../httpStatus.enum'
/** 授权模块业务码枚举 */
export enum AuthBusiness {
  /** 密码错误 */
  INCORRECT_PASSWORD = '4200',
  /** 用户不存在 */
  USER_NOT_FOUND = '4201',
}

/** 授权模块业务码文本映射 */
export const AuthBusinessTextMap: Record<AuthBusiness, [string, number]> = {
  [AuthBusiness.INCORRECT_PASSWORD]: ['密码错误', HttpStatus.UNAUTHORIZED],
  [AuthBusiness.USER_NOT_FOUND]: ['用户不存在', HttpStatus.NOT_FOUND],
}
