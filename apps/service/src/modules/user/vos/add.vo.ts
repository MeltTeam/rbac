import type { UserEntity } from '../entities/user.entity'
import type { ProfileEntity } from '@/modules/user/entities/profile.entity'

export class Profile {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: number
  nickName: string
  sex: number
  birthday: Date | null
  email: string | null
  phone: string | null
  avatar: string
  constructor({ id, createdBy, updatedBy, createdAt, updatedAt, remark, status, nickName, sex, birthday, email, phone, avatar }: ProfileEntity) {
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
export class AddVo {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: number
  name: string
  profile: Profile
  constructor({ id, createdBy, updatedBy, createdAt, updatedAt, remark, status, name, profile }: UserEntity) {
    this.id = id
    this.createdBy = createdBy
    this.updatedBy = updatedBy
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.remark = remark
    this.status = status
    this.name = name
    this.profile = new Profile(profile)
  }
}
