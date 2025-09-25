import type { SexEnum } from '../../enums'
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
  /** 用户名 */
  name?: string
  /** 别名 */
  nickName?: string
  /** 性别 */
  sex?: SexEnum
  /** 生日 */
  birthday?: Date
  /** 邮箱 */
  email?: string
  /** 电话号码 */
  phone?: string
  /** 头像 */
  avatar?: string
  /** 备注 */
  remark?: string
}
