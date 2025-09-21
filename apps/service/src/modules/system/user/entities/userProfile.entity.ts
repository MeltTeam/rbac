import type { IUserProfileEntity } from '../IUser'
import { SexEnum } from '@packages/types'
import { Column, Entity, OneToOne } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { UserEntity } from './user.entity'

@Entity({ name: 'sys_user_profile', comment: '用户档案表' })
export class UserProfileEntity extends CommonEntity implements IUserProfileEntity {
  @Column({
    comment: '用户别名',
    name: 'nick_name',
    type: 'varchar',
    length: 64,
    charset: 'utf8mb4',
    default: '',
  })
  nickName: string

  @Column({
    comment: '性别',
    name: 'sex',
    type: 'tinyint',
    unsigned: true,
    default: SexEnum.UNKNOWN,
  })
  sex: SexEnum

  @Column({
    comment: '出生日期',
    name: 'birthday',
    type: 'date',
    nullable: true,
    default: null,
  })
  birthday: Date | null

  @Column({
    comment: '用户邮箱',
    name: 'email',
    type: 'varchar',
    length: 254,
    nullable: true,
    default: null,
  })
  email: string | null

  @Column({
    comment: '电话号码',
    name: 'phone',
    type: 'varchar',
    length: 11,
    nullable: true,
    default: null,
  })
  phone: string | null

  @Column({
    comment: '头像地址',
    name: 'avatar',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: `https://cn.cravatar.com/avatar/`,
  })
  avatar: string

  @OneToOne(() => UserEntity, (user) => user.profile)
  user: UserEntity
}
