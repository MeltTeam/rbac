/** 权限类型枚举 */
export enum PermissionTypeEnum {
  /** 菜单 */
  MENU = 10,
  /** 按钮 */
  BUTTON = 20,
  /** 接口 */
  API = 30,
  /** 目录 */
  DIRECTORY = 40,
}

/** 权限类型枚举文本映射 */
export const PermissionTypeTextMap: Record<PermissionTypeEnum, string> = {
  [PermissionTypeEnum.MENU]: '菜单',
  [PermissionTypeEnum.BUTTON]: '按钮',
  [PermissionTypeEnum.API]: '接口',
  [PermissionTypeEnum.DIRECTORY]: '目录',
}
