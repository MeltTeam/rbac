import type { IResourceEntity } from '../IResource'
import { MethodTypeEnum, ResourceTypeEnum } from '@packages/types'
import { Column, Entity, Index, ManyToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'

@Entity({ name: 'sys_resource', comment: '资源表' })
@Index(['name', 'resourceCode'], { unique: true })
export class ResourceEntity extends CommonEntity implements IResourceEntity {
  @Column({
    comment: '资源名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '资源编码(资源类型:请求类型:资源路径)',
    name: 'resource_code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  resourceCode: string

  @Column({
    comment: '请求类型',
    name: 'method_type',
    type: 'tinyint',
    unsigned: true,
    default: MethodTypeEnum.GET,
  })
  methodType: MethodTypeEnum

  @Column({
    comment: '资源路径',
    name: 'path',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  path: string

  @Column({
    comment: '资源类型',
    name: 'resource_type',
    type: 'tinyint',
    unsigned: true,
    default: ResourceTypeEnum.API,
  })
  resourceType: ResourceTypeEnum

  @ManyToMany(() => PermissionEntity, (permission) => permission.menus)
  permissions: PermissionEntity[]
}
