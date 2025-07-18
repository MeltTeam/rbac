import type { SexEnum } from '../enums'
/** 添加用户接口参数校验 */
export interface IAddUserDto {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** 修改用户接口参数校验 */
export interface IPatchUserDto {
  /** 用户名 */
  username: string
  /** 别名 */
  nickName: string
  /** 性别 */
  sex: SexEnum
  /** 生日 */
  birthday: Date
  /** 邮箱 */
  email: string
  /** 电话号码 */
  phone: string
  /** 头像 */
  avatar: string
}
