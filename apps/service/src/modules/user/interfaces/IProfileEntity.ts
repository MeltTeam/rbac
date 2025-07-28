import type { SexEnum } from '@packages/types'
import type { UserEntity } from '../entities/user.entity'

/** 档案表实体接口 */
export interface IProfileEntity {
  /** 用户别名 */
  nickName: string
  /** 性别(10:女 20:男 30:未知 默认:30) */
  sex: SexEnum
  /** 出生日期 */
  birthday: Date | null
  /** 用户邮箱 */
  email: string | null
  /** 电话号码 */
  phone: string | null
  /** 头像地址 */
  avatar: string | null

  /** 档案1-1用户 */
  user: UserEntity
}
