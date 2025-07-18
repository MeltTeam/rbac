/** 资源类型枚举 */
export enum ResourceTypeEnum {
  /** 菜单 */
  MENU = 10,
  /** 按钮 */
  BUTTON = 20,
  /** 接口 */
  API = 30,
  /** 目录 */
  DIRECTORY = 40,
}

/** 资源类型枚举文本映射 */
export const ResourceTypeTextMap: Record<ResourceTypeEnum, string> = {
  [ResourceTypeEnum.MENU]: '菜单',
  [ResourceTypeEnum.BUTTON]: '按钮',
  [ResourceTypeEnum.API]: '接口',
  [ResourceTypeEnum.DIRECTORY]: '目录',
}
