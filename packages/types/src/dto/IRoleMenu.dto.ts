/** 替换角色的菜单(全量替换)接口参数校验  */
export interface IReplaceRoleMenuDTO {
  /** 角色ID */
  id: string
  /** 菜单ID列表 */
  menuIds: string[]
}

/** 批量替换角色的菜单(全量替换)接口参数校验  */
export interface IReplaceRolesMenuDTO {
  /** 角色ID列表 */
  ids: string[]
  /** 菜单ID列表 */
  menuIds: string[]
}
