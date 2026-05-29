/** 替换部门的角色(全量替换)接口参数校验  */
export interface IReplaceDeptRoleDTO {
  /** 部门ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

/** 批量替换部门的角色(全量替换)接口参数校验  */
export interface IReplaceDeptsRoleDTO {
  /** 部门ID列表 */
  ids: string[]
  /** 角色ID列表 */
  roleIds: string[]
}
