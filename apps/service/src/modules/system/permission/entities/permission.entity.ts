import type { IPermissionEntity } from '@/modules/system/permission/IPermission'
import { ActionTypeEnum } from '@packages/types'
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { MenuEntity } from '@/modules/system/menu/entities/menu.entity'
import { ResourceEntity } from '@/modules/system/resource/entities/resource.entity'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'
import { PERMISSION_CODE_MAX, PERMISSION_DOMAIN_MAX, PERMISSION_NAME_MAX, SYS_PERMISSION_MENU, SYS_PERMISSION_RESOURCE } from '../permission.constant'

@Entity({ name: 'sys_permission', comment: '权限表' })
@Index(['name', 'permissionCode'], { unique: true })
export class PermissionEntity extends CommonEntity implements IPermissionEntity {
  @Column({
    comment: '权限名',
    name: 'name',
    type: 'varchar',
    length: PERMISSION_NAME_MAX,
    unique: true,
  })
  name: string

  @Column({
    comment: '权限编码(领域:操作类型)',
    name: 'permission_code',
    type: 'varchar',
    length: PERMISSION_CODE_MAX,
    unique: true,
  })
  permissionCode: string

  @Column({
    comment: '领域',
    name: 'domain',
    type: 'varchar',
    length: PERMISSION_DOMAIN_MAX,
  })
  domain: string

  @Column({
    comment: '操作类型',
    name: 'action_type',
    type: 'tinyint',
    unsigned: true,
    default: ActionTypeEnum.MANAGE,
  })
  actionType: ActionTypeEnum

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
    name: SYS_PERMISSION_MENU,
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
    name: SYS_PERMISSION_RESOURCE,
    joinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'resource_id', referencedColumnName: 'id' }],
  })
  resources: ResourceEntity[]
}
