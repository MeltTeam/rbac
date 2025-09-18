import { IUserProfile, SexEnum } from '@packages/types'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { UserProfileEntity } from '../entities/userProfile.entity'

@ApiModel(
  {
    id: { type: String, description: '业务ID', example: 'xxx' },
    createdBy: { type: String, description: '创建者', example: 'xxx' },
    updatedBy: { type: String, description: '更新者', example: 'xxx' },
    createdAt: { type: Date, description: '创建时间', example: 'xxx' },
    updatedAt: { type: Date, description: '更新时间', example: 'xxx' },
    remark: { type: String, description: '备注', example: 'xxx' },
    status: { type: Number, description: '状态', example: 'xxx' },
    nickName: { type: String, description: '用户昵称', example: '张三' },
    sex: { enum: SexEnum, description: '性别：10 未知 男 20 女 30', example: 20 },
    birthday: { type: Date, description: '生日', example: '2000-01-01' },
    email: { type: String, description: '邮箱', example: 'zhangsan@example.com' },
    phone: { type: String, description: '手机号', example: '13800138000' },
    avatar: { type: String, description: '头像 URL', example: 'https://example.com/avatar.jpg' },
  },
  { description: '用户档案' },
)
export class UserProfileVO implements IUserProfile {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: number
  nickName: string
  sex: SexEnum
  birthday: Date | null
  email: string | null
  phone: string | null
  avatar: string
  constructor(userProfile?: UserProfileEntity) {
    if (userProfile) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, nickName, sex, birthday, email, phone, avatar } = userProfile
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.nickName = nickName
      this.sex = sex
      this.birthday = birthday
      this.email = email
      this.phone = phone
      this.avatar = avatar
    }
  }
}
