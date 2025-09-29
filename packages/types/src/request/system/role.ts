/** 创建角色接口参数校验 */
export interface ICreateRoleDTO {
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 父角色ID */
  parentId?: string
  /** 备注 */
  remark?: string
}

/** 更新角色接口参数校验 */
export interface IUpdateRoleDTO {
  /** 角色名 */
  name?: string
  /** 角色编码 */
  roleCode?: string
  /** 备注 */
  remark?: string
}
