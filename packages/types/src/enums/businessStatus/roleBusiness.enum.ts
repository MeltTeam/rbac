/** 角色模块业务码枚举 */
export enum RoleBusiness {
  /** 角色未找到 */
  NOT_FOUND = 1101,
  /** 角色已存在 */
  ALREADY_EXISTS = 1102,
  /** 角色权限未找到 */
  PERMISSIONS_NOT_FOUND = 1103,
  /** 角色分配成功 */
  ASSIGN_SUCCESS = 1104,
  /** 角色分配失败 */
  ASSIGN_FAILED = 1105,
  /** 角色删除失败，因为存在关联用户 */
  DELETE_FAILED_DUE_TO_ASSOCIATED_USERS = 1106,
  /** 角色数据权限范围无效 */
  DATA_SCOPE_INVALID = 1107,
}

/** 角色模块业务码文本映射 */
export const RoleBusinessTextMap: Record<RoleBusiness, string> = {
  [RoleBusiness.NOT_FOUND]: '角色未找到',
  [RoleBusiness.ALREADY_EXISTS]: '角色已存在',
  [RoleBusiness.PERMISSIONS_NOT_FOUND]: '角色权限未找到',
  [RoleBusiness.ASSIGN_SUCCESS]: '角色分配成功',
  [RoleBusiness.ASSIGN_FAILED]: '角色分配失败',
  [RoleBusiness.DELETE_FAILED_DUE_TO_ASSOCIATED_USERS]: '角色删除失败，因为存在关联用户',
  [RoleBusiness.DATA_SCOPE_INVALID]: '角色数据权限范围无效',
}
