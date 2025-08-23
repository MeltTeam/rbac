import type { SexEnum, StatusEnum } from '../enums'

/** 用户档案 */
export interface IUserProfile {
  /** 档案ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 档案备注 */
  remark: string | null
  /** 档案状态 */
  status: StatusEnum
  /** 别名 */
  nickName: string
  /** 性别 */
  sex: SexEnum
  /** 生日 */
  birthday: Date | null
  /** 邮箱 */
  email: string | null
  /** 电话号码 */
  phone: string | null
  /** 头像 */
  avatar: string
}

/** 新增用户响应数据 */
export interface IUserVO {
  /** 用户ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 用户备注 */
  remark: string | null
  /** 用户状态 */
  status: StatusEnum
  /** 用户名 */
  name: string
  /** 用户档案 */
  profile: IUserProfile
}
