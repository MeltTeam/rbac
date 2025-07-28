import type { IResourceEntity } from '../interfaces/IResourceEntity'
import { CheckEnum, ResourceTypeEnum, SortOrderEnum } from '@packages/types'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { RoleEntity } from '@/modules/role/entities/role.entity'

/** 资源表实体 */
@Entity({ name: 'resource', comment: '资源表' })
export class ResourceEntity extends CommonEntity implements IResourceEntity {
  constructor() {
    super()
  }

  @Column({
    comment: '资源名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Index('IDX_RESOURCE_PARENT_ID', ['parent_id'])
  @Column({
    comment: '父级资源ID',
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
    comment: '资源编码',
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  code: string

  @Index('IDX_RESOURCE_SORT_ORDER', ['sort_order'])
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
    comment: '资源类型',
    name: 'type',
    type: 'tinyint',
    unsigned: true,
    default: ResourceTypeEnum.MENU,
  })
  type: ResourceTypeEnum

  @ManyToOne(() => RoleEntity, (role) => role.resources)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role: RoleEntity
}
