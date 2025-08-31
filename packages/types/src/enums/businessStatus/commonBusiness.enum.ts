import { HttpStatus } from '../httpStatus.enum'
/** 公共模块业务码枚举 */
export enum CommonBusiness {
  PROMPT_FOR_MODIFICATION = 1001,
}

/** 公共模块业务码文本映射 */
export const CommonBusinessTextMap: Record<CommonBusiness, [string, number]> = {
  [CommonBusiness.PROMPT_FOR_MODIFICATION]: ['请输入修改项', HttpStatus.BAD_REQUEST],
}
