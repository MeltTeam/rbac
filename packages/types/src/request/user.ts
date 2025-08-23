import type { SexEnum } from '../enums'
/** 添加用户接口参数校验 */
export interface IAddUserDTO {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd: string
  /** 备注 */
  remark?: string
}

/** 修改用户接口参数校验 */
export interface IPatchUserDTO {
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

/** 修改用户密码接口参数校验 */
export interface IUpdatePwdUserDTO {
  /** 密码 */
  pwd: string
  /** 备注 */
  remark?: string
}
