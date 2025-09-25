import type { IResourceService } from './IResource'
import { Injectable } from '@nestjs/common'
import { ResourceVO } from './vo'

@Injectable()
export class ResourceService implements IResourceService {
  async create() {
    const VO = new ResourceVO()
    return VO
  }
}
