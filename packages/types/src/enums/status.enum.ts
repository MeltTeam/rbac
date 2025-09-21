/** 状态枚举 */
export enum StatusEnum {
  /** 未知 */
  UNKNOWN = 10,
  /** 启用 */
  ENABLE = 20,
  /** 禁用 */
  DISABLE = 30,
}

/** 状态枚举文本映射 */
export const StatusTextMap: Record<StatusEnum, string> = {
  [StatusEnum.UNKNOWN]: '未知',
  [StatusEnum.ENABLE]: '启用',
  [StatusEnum.DISABLE]: '禁用',
}
