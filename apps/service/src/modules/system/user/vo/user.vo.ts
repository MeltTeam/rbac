import type { IUserProfile, IUserVO } from '@packages/types'
import type { UserEntity } from '../entities/user.entity'
import { UserProfileEntity } from '../entities/userProfile.entity'

export class Profile implements IUserProfile {
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
  constructor({ id, createdBy, updatedBy, createdAt, updatedAt, remark, status, nickName, sex, birthday, email, phone, avatar }: UserProfileEntity) {
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
export class UserVO implements IUserVO {
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
