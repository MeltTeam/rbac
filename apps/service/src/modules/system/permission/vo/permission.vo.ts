import type { IPermissionVo, StatusEnum } from '@packages/types'
import type { PermissionEntity } from '../entities/permission.entity'

export class PermissionVO implements IPermissionVo {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: StatusEnum
  name: string
  permissionCode: string
  constructor(permission?: PermissionEntity) {
    if (permission) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, name, permissionCode } = permission
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.name = name
      this.permissionCode = permissionCode
    }
  }
}
