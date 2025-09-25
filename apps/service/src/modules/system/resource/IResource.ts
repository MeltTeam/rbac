import type { MethodTypeEnum, ResourceTypeEnum } from '@packages/types'
import type { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'

/** 资源表实体接口 */
export interface IResourceEntity {
  /** 资源名 */
  name: string
  /** 资源编码 */
  resourceCode: string
  /** 请求类型 */
  methodType: MethodTypeEnum
  /** 资源路径 */
  path: string
  /** 资源类型 */
  resourceType: ResourceTypeEnum
  /** 资源N-N权限 */
  permissions: PermissionEntity[]
}

/** 资源模块服务接口 */
export interface IResourceService {}

/** 资源模块控制器接口 */
export interface IResourceController {}
