import type { UserEntity } from '../entities/user.entity'
import { IUserVO, StatusEnum } from '@packages/types'
import { ApiModel } from '@/common/decorators'
import { PostVO } from '@/modules/system/post/vo'
import { RoleVO } from '@/modules/system/role/vo'
import { UserProfileVO } from './userProfile.vo'

@ApiModel(
  {
    id: { type: String, description: '业务ID', example: 'xxx' },
    createdBy: { type: String, description: '创建者', example: 'xxx' },
    updatedBy: { type: String, description: '更新者', example: 'xxx' },
    createdAt: { type: Date, description: '创建时间', example: 'xxx' },
    updatedAt: { type: Date, description: '更新时间', example: 'xxx' },
    remark: { type: String, description: '备注', example: 'xxx' },
    status: { enum: StatusEnum, description: '状态(未知:10 启用:20 禁用:30)', example: StatusEnum.ENABLE },
    name: { type: String, description: '用户名', example: 'admin' },
    loginIp: { type: String, description: '最后登录的IP', example: '172.0.0.1' },
    loginAt: { type: Date, description: '最后登录时间', example: 'xxx' },
    profile: { type: UserProfileVO, description: '用户档案' },
    roles: { type: RoleVO, description: '拥有角色列表', isArray: true },
    post: { type: PostVO, description: '拥有岗位' },
  },
  { description: '用户详情' },
)
export class UserVO implements IUserVO {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: StatusEnum
  name: string
  loginIp: string | null
  loginAt: Date | null
  profile: UserProfileVO
  roles: RoleVO[]
  post: PostVO | null

  constructor(user?: UserEntity) {
    if (user) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, name, profile, loginIp, loginAt, roles, post } = user
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.name = name
      this.loginIp = loginIp
      this.loginAt = loginAt
      this.profile = new UserProfileVO(profile)
      this.roles = roles ? roles.map((role) => new RoleVO(role)) : []
      this.post = post ? new PostVO(post) : null
    }
  }
}
