/** 选择枚举 */
export enum CheckEnum {
  /** 是 */
  TRUE = 10,
  /** 否 */
  FALSE = 20,
}

/** 选择枚举文本映射 */
export const CheckTextMap: Record<CheckEnum, string> = {
  [CheckEnum.TRUE]: '是',
  [CheckEnum.FALSE]: '否',
}
