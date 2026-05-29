/** 替换岗位的角色(全量替换)接口参数校验  */
export interface IReplacePostRoleDTO {
  /** 岗位ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

/** 批量替换岗位的角色接口(全量替换)参数校验  */
export interface IReplacePostsRoleDTO {
  /** 岗位ID列表 */
  ids: string[]
  /** 角色ID列表 */
  roleIds: string[]
}
