import type { ProfileEntity } from '../entities/profile.entity'
import type { PostEntity } from '@/modules/post/entities/post.entity'
import type { RoleEntity } from '@/modules/role/entities/role.entity'

/** 用户表实体接口 */
export interface IUserEntity {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd?: string
  /** 最后登录的IP */
  loginIp: string | null
  /** 最后登录时间 */
  loginAt: Date | null
  /** 密码最后更新时间 */
  pwdUpdateAt: Date | null
  /** 密码最后更新者 */
  pwdUpdateBy: string | null
  /** 盐值 */
  salt?: string
  /** 插入前生成盐值 */
  generateSalt: () => void

  /** 用户1-1档案 */
  profile?: ProfileEntity
  /** 用户N-1角色 */
  role?: RoleEntity
  /** 用户1-N岗位 */
  posts?: PostEntity[]
}
