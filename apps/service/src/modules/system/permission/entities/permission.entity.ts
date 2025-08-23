import type { IPermissionEntity } from '@permission/IPermission'
import { CommonEntity } from '@entities/common.entity'
import { CheckEnum, PermissionTypeEnum, SortOrderEnum } from '@packages/types'
import { RoleEntity } from '@role/entities/role.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

/** 权限表实体 */
@Entity({ name: 'sys_permission', comment: '权限表' })
export class PermissionEntity extends CommonEntity implements IPermissionEntity {
  constructor() {
    super()
  }

  @Column({
    comment: '权限名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Index('IDX_PERMISSION_PARENT_ID', ['parent_id'])
  @Column({
    comment: '父级权限ID',
    name: 'parent_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  parentId: string

  @Column({
    comment: '祖级列表',
    name: 'ancestors',
    type: 'text',
    charset: 'utf8mb4',
  })
  ancestors: string

  @Column({
    comment: '权限编码',
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  code: string

  @Index('IDX_PERMISSION_SORT_ORDER', ['sort_order'])
  @Column({
    comment: '显示顺序',
    name: 'sort_order',
    type: 'tinyint',
    unsigned: true,
    default: SortOrderEnum.HIGH_PRIORITY,
  })
  sortOrder: SortOrderEnum

  @Column({
    comment: '访问地址',
    name: 'path',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  path: string

  @Column({
    comment: '路由参数',
    name: 'query',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  query: string

  @Column({
    comment: '组件路径',
    name: 'component',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  component: string

  @Column({
    comment: '路由名称',
    name: 'route_name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  routeName: string

  @Column({
    comment: '图标地址',
    name: 'icon',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  icon: string

  @Column({
    comment: '是否为外链',
    name: 'is_frame',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isFrame: CheckEnum

  @Column({
    comment: '是否缓存',
    name: 'is_cache',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isCache: CheckEnum

  @Column({
    comment: '是否隐藏',
    name: 'is_visible',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isVisible: CheckEnum

  @Column({
    comment: '权限类型',
    name: 'type',
    type: 'tinyint',
    unsigned: true,
    default: PermissionTypeEnum.MENU,
  })
  type: PermissionTypeEnum

  @ManyToOne(() => RoleEntity, (role) => role.permissions)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role: RoleEntity
}
