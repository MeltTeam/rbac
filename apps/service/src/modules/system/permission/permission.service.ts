import { Injectable } from '@nestjs/common'
import { PermissionVO } from './vo'

@Injectable()
export class PermissionService {
  async create() {
    const VO = new PermissionVO()
    return VO
  }
}
