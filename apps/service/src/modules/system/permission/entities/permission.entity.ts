import type { IPermissionEntity } from '@/modules/system/permission/IPermission'
import { Column, Entity, ManyToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'

@Entity({ name: 'sys_permission', comment: '权限表' })
export class PermissionEntity extends CommonEntity implements IPermissionEntity {
  @Column({
    comment: '父级权限ID',
    name: 'parent_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  parentId: string

  @Column({
    comment: '权限名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '权限编码',
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  code: string

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[]
}
