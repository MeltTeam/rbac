/** 顺序优先级枚举 */
export enum SortOrderEnum {
  /** 高优先级 */
  HIGH_PRIORITY = 10,
  /** 中等优先级 */
  MEDIUM_PRIORITY = 20,
  /** 低优先级 */
  LOW_PRIORITY = 30,
}

/** 顺序优先级枚举文本映射 */
export const SortOrderTextMap: Record<SortOrderEnum, string> = {
  [SortOrderEnum.HIGH_PRIORITY]: '高',
  [SortOrderEnum.MEDIUM_PRIORITY]: '中',
  [SortOrderEnum.LOW_PRIORITY]: '低',
}
