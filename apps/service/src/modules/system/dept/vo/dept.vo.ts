import type { IDeptVO, StatusEnum } from '@packages/types'
import type { DeptEntity } from '../entities/dept.entity'

export class DeptVO implements IDeptVO {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: StatusEnum
  parentId: string | null
  name: string
  leaderId: string
  email: string | null
  phone: string | null
  deptCode: string
  constructor(dept?: DeptEntity) {
    if (dept) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, parentId, name, leaderId, email, phone, deptCode } = dept
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.parentId = parentId
      this.name = name
      this.leaderId = leaderId
      this.email = email
      this.phone = phone
      this.deptCode = deptCode
    }
  }
}
