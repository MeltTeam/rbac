import type { IUserEntity } from '../interfaces/IUserEntity'
import { Expose } from 'class-transformer'
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { uuid_v4 } from '@/common/utils'
import { PostEntity } from '@/modules/post/entities/post.entity'
import { RoleEntity } from '@/modules/role/entities/role.entity'
import { ProfileEntity } from './profile.entity'

/** 用户表实体 */
@Entity({ name: 'user', comment: '用户表' })
export class UserEntity extends CommonEntity implements IUserEntity {
  constructor() {
    super()
  }

  @Column({
    comment: '用户名',
    name: 'name',
    type: 'varchar',
    length: 64,
    charset: 'utf8mb4',
  })
  name: string

  @Column({
    comment: '密码',
    name: 'pwd',
    type: 'varchar',
    length: 100,
    select: false,
  })
  pwd: string

  @Column({
    comment: '最后登录的IP',
    name: 'login_ip',
    type: 'varchar',
    length: 128,
    nullable: true,
    default: null,
  })
  loginIp: string | null

  @Column({
    comment: '最后登录时间',
    name: 'login_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
    default: null,
  })
  loginAt: Date | null

  @Column({
    comment: '密码最后更新时间',
    name: 'pwd_update_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
    default: null,
  })
  pwdUpdateAt: Date | null

  @Column({
    comment: '密码最后更新者',
    name: 'pwd_update_By',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    nullable: true,
    default: null,
  })
  pwdUpdateBy: string | null

  @Column({
    comment: '盐值',
    name: 'salt',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    select: false,
  })
  salt: string

  @Expose()
  @BeforeInsert()
  generateSalt() {
    if (!this.salt) this.salt = uuid_v4()
  }

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  profile: ProfileEntity

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role: RoleEntity

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[]
}
