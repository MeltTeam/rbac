import { HttpStatus } from '../httpStatus.enum'
/** 验证码模块业务码枚举 */
export enum CaptchaBusiness {
  /** 验证码错误 */
  CODE_INVALID = '1100',
  /** 验证码已过期 */
  CODE_EXPIRED = '1101',
  /** 当前邮箱地址发送验证码次数过多,请稍后重试 */
  SEND_TOO_FREQUENT = '1102',
}

/** 验证码模块业务码文本映射 */
export const CaptchaBusinessTextMap: Record<CaptchaBusiness, [string, number]> = {
  [CaptchaBusiness.CODE_INVALID]: ['验证码错误', HttpStatus.BAD_REQUEST],
  [CaptchaBusiness.CODE_EXPIRED]: ['验证码已过期', HttpStatus.BAD_REQUEST],
  [CaptchaBusiness.SEND_TOO_FREQUENT]: ['当前邮箱地址发送验证码次数过多,请稍后重试!!!', HttpStatus.TOO_MANY_REQUESTS],
}
