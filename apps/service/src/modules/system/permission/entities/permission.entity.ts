import type { IPermissionEntity } from '@/modules/system/permission/IPermission'
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { MenuEntity } from '@/modules/system/menu/entities/menu.entity'
import { ResourceEntity } from '@/modules/system/resource/entities/resource.entity'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'

@Entity({ name: 'sys_permission', comment: '权限表' })
@Index(['name', 'permissionCode', 'domain'], { unique: true })
export class PermissionEntity extends CommonEntity implements IPermissionEntity {
  @Column({
    comment: '权限名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '权限编码(领域:操作类型)',
    name: 'permission_code',
    type: 'varchar',
    length: 41,
    unique: true,
  })
  permissionCode: string

  @Column({
    comment: '领域',
    name: 'domain',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  domain: string

  @Column({
    comment: '操作类型',
    name: 'action',
    type: 'varchar',
    length: 20,
  })
  action: string

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[]

  @ManyToMany(() => MenuEntity, (menu) => menu.permissions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: 'sys_permission_menu',
    joinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
  })
  menus: MenuEntity[]

  @ManyToMany(() => ResourceEntity, (resource) => resource.permissions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: 'sys_permission_resource',
    joinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'resource_id', referencedColumnName: 'id' }],
  })
  resources: ResourceEntity[]
}
