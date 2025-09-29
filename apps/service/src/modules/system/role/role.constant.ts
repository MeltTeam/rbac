export const ROLE_ID = '角色ID'
export const ROLE_NAME = '角色名'
export const ROLE_NAME_MIN = 2
export const ROLE_NAME_MAX = 64
export const ROLE_CODE = '角色编码'
export const ROLE_CODE_MIN = 2
export const ROLE_CODE_MAX = 64
export const ROLE_PARENT_ID = '父角色ID'
/** 内置角色 */
export const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: '超级管理员',
    roleCode: 'SUPER',
  },
  ADMIN: {
    name: '管理员',
    roleCode: 'ADMIN',
  },
  USER: {
    name: '普通用户',
    roleCode: 'USER',
  },
}

/** 角色权限中间表名 */
export const SYS_ROLE_PERMISSION = 'sys_role_permission'

/** 角色部门中间表名 */
export const SYS_ROLE_DEPT = 'sys_role_dept'
