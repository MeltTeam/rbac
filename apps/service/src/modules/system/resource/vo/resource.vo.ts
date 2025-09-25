import type { ResourceEntity } from '../entities/resource.entity'

export class ResourceVO {
  constructor(resource?: ResourceEntity) {
    if (resource) {
      console.warn(resource)
    }
  }
}
