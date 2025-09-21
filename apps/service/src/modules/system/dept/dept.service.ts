import type { IDeptService } from './IDept'
import { Injectable } from '@nestjs/common'
import { DeptVO } from './vo'

@Injectable()
export class DeptService implements IDeptService {
  async create() {
    const VO = new DeptVO()
    return VO
  }
}
