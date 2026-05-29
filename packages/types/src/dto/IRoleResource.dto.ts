/** 替换角色的资源(全量替换)接口参数校验  */
export interface IReplaceRoleResourceDTO {
  /** 角色ID */
  id: string
  /** 资源ID列表 */
  resourceIds: string[]
}

/** 批量替换角色的资源(全量替换)接口参数校验  */
export interface IReplaceRolesResourceDTO {
  /** 角色ID列表 */
  ids: string[]
  /** 资源ID列表 */
  resourceIds: string[]
}
