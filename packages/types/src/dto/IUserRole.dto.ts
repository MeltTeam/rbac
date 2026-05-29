/** 替换用户的角色(全量替换)接口参数校验  */
export interface IReplaceUserRoleDTO {
  /** 用户ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

/** 批量替换用户的角色(全量替换)接口参数校验  */
export interface IReplaceUsersRoleDTO {
  /** 用户ID列表 */
  ids: string[]
  /** 角色ID列表 */
  roleIds: string[]
}
