import type { IRoleVO, StatusEnum } from '@packages/types'
import type { RoleEntity } from '../entities/role.entity'
import { DeptVO } from '@/modules/system/dept/vo'
import { PermissionVO } from '@/modules/system/permission/vo'

export class RoleVO implements IRoleVO {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: StatusEnum
  parentId: string | null
  name: string
  code: string
  permissions: PermissionVO[]
  depts: DeptVO[]

  constructor(role?: RoleEntity) {
    if (role) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, parentId, name, code, permissions, depts } = role
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.parentId = parentId
      this.name = name
      this.code = code
      this.permissions = permissions.map((permission) => new PermissionVO(permission))
      this.depts = depts.map((dept) => new DeptVO(dept))
    }
  }
}
