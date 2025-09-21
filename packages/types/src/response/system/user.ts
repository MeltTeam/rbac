import type { SexEnum, StatusEnum } from '../../enums'
import type { IFindAllVO } from '../common'
import type { IPostVO } from './post'
import type { IRoleVO } from './role'

/** 用户档案 */
export interface IUserProfileVO {
  /** 业务ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 备注 */
  remark: string | null
  /** 状态 */
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

/** 用户详情 */
export interface IUserVO {
  /** 业务ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 备注 */
  remark: string | null
  /** 状态 */
  status: StatusEnum
  /** 用户名 */
  name: string
  /** 用户档案 */
  profile: IUserProfileVO
  /** 拥有角色列表 */
  roles: IRoleVO[]
  /** 拥有岗位 */
  post: IPostVO | null
}

/** 分页查询用户详情列表 */
export interface IFindAllUserVO extends IFindAllVO<IUserVO> {}
