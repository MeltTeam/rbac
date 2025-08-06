/** 状态枚举 */
export enum StatusEnum {
  /** 禁用 */
  DISABLE = 10,
  /** 启用 */
  ENABLE = 20,
  /** 未知 */
  UNKNOWN = 30,
}

/** 状态枚举文本映射 */
export const StatusTextMap: Record<StatusEnum, string> = {
  [StatusEnum.DISABLE]: '禁用',
  [StatusEnum.ENABLE]: '启用',
  [StatusEnum.UNKNOWN]: '未知',
}
