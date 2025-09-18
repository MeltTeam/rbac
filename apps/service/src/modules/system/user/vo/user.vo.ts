import type { IUserVO } from '@packages/types'
import type { UserEntity } from '../entities/user.entity'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { UserProfileVO } from './userProfile.vo'

@ApiModel(
  {
    id: { type: String, description: '业务ID', example: 'xxx' },
    createdBy: { type: String, description: '创建者', example: 'xxx' },
    updatedBy: { type: String, description: '更新者', example: 'xxx' },
    createdAt: { type: Date, description: '创建时间', example: 'xxx' },
    updatedAt: { type: Date, description: '更新时间', example: 'xxx' },
    remark: { type: String, description: '备注', example: 'xxx' },
    status: { type: Number, description: '状态', example: 'xxx' },
    name: { type: String, description: '用户名', example: 'xxx' },
    loginIp: { type: String, description: '最后登录的IP', example: 'xxx' },
    loginAt: { type: Date, description: '最后登录时间', example: 'xxx' },
    profile: { type: UserProfileVO, description: '用户档案' },
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
  status: number
  name: string
  loginIp: string | null
  loginAt: Date | null
  profile: UserProfileVO

  constructor(user?: UserEntity) {
    if (user) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, name, profile, loginIp, loginAt } = user
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
    }
  }
}
