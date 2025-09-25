import { HttpStatus } from '../httpStatus.enum'
/** 角色模块业务码枚举 */
export enum RoleBusiness {
  /** 角色未找到 */
  NOT_FOUND = '4300',
  /** 角色名已存在 */
  NAME_ALREADY_EXISTS = '4301',
  /** 角色编码已存在 */
  CODE_ALREADY_EXISTS = '4302',
}

/** 角色模块业务码文本映射 */
export const RoleBusinessTextMap: Record<RoleBusiness, [string, number]> = {
  [RoleBusiness.NOT_FOUND]: ['角色未找到', HttpStatus.NOT_FOUND],
  [RoleBusiness.NAME_ALREADY_EXISTS]: ['角色名已存在', HttpStatus.CONFLICT],
  [RoleBusiness.CODE_ALREADY_EXISTS]: ['角色编码已存在', HttpStatus.CONFLICT],
}
