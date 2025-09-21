import type { IPostVO, StatusEnum } from '@packages/types'
import type { PostEntity } from '../entities/post.entity'
import { DeptVO } from '@/modules/system/dept/vo'

export class PostVO implements IPostVO {
  id: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  remark: string | null
  status: StatusEnum
  name: string
  code: string
  dept: DeptVO | null
  constructor(post?: PostEntity) {
    if (post) {
      const { id, createdBy, updatedBy, createdAt, updatedAt, remark, status, name, code, dept } = post
      this.id = id
      this.createdBy = createdBy
      this.updatedBy = updatedBy
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.remark = remark
      this.status = status
      this.name = name
      this.code = code
      this.dept = dept ? new DeptVO(dept) : null
    }
  }
}
