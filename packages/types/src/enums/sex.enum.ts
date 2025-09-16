/** 性别枚举 */
export enum SexEnum {
  /** 未知 */
  UNKNOWN = 10,
  /** 男 */
  MALE = 20,
  /** 女 */
  FEMALE = 30,
}

/** 性别枚举文本映射 */
export const SexTextMap: Record<SexEnum, string> = {
  [SexEnum.FEMALE]: '女',
  [SexEnum.MALE]: '男',
  [SexEnum.UNKNOWN]: '未知',
}
