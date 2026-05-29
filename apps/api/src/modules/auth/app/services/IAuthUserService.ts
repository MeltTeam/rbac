import type { EntityManager } from 'typeorm'
import type { IUserEntity } from '@/modules/rbac/user/domain'

/** 标识符类型 */
export type TIdentifierType = 'svg' | 'email' | 'phone'

/** 登录凭证 */
export interface ILoginCredentials {
  /** 用户标识符(用户名/邮箱/手机号) */
  identifier: string
  /** 密码 */
  password: string
  /** 验证码 */
  captcha: string
}

/** 认证用户服务接口 */
export interface IAuthUserService {
  /** 根据标识符获取用户 */
  getUserByIdentifier: (identifier: string, type: TIdentifierType, em?: EntityManager) => Promise<IUserEntity>
  /** 验证密码 */
  validatePassword: (password: string, user: IUserEntity) => Promise<boolean>
  /** 更新登录信息 */
  updateLoginInfo: (user: IUserEntity, em?: EntityManager) => Promise<void>
}
