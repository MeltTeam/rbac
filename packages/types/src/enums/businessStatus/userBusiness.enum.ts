/** 用户模块业务码枚举 */
export enum UserBusiness {
  /** 用户未找到 */
  NOT_FOUND = 1001,
  /** 用户已存在 */
  ALREADY_EXISTS = 1002,
  /** 用户已被禁用 */
  DISABLED = 1003,
  /** 用户登录失败 */
  LOGIN_FAILED = 1004,
  /** 用户密码已过期 */
  PASSWORD_EXPIRED = 1005,
  /** 用户密码重置成功 */
  PASSWORD_RESET_SUCCESS = 1006,
  /** 用户密码重置失败 */
  PASSWORD_RESET_FAILED = 1007,
  /** 用户无权限 */
  PERMISSION_DENIED = 1008,
  /** 用户账户被锁定 */
  ACCOUNT_LOCKED = 1009,
}

/** 用户模块业务码文本映射 */
export const UserBusinessTextMap: Record<UserBusiness, string> = {
  [UserBusiness.NOT_FOUND]: '用户未找到',
  [UserBusiness.ALREADY_EXISTS]: '用户已存在',
  [UserBusiness.DISABLED]: '用户已被禁用',
  [UserBusiness.LOGIN_FAILED]: '用户登录失败',
  [UserBusiness.PASSWORD_EXPIRED]: '用户密码已过期',
  [UserBusiness.PASSWORD_RESET_SUCCESS]: '用户密码重置成功',
  [UserBusiness.PASSWORD_RESET_FAILED]: '用户密码重置失败',
  [UserBusiness.PERMISSION_DENIED]: '用户无权限',
  [UserBusiness.ACCOUNT_LOCKED]: '用户账户被锁定',
}
