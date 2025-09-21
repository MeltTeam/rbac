import type { CreateRoleDTO } from './dto'
import type { IRoleService } from './IRole'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { RoleEntity } from './entities/role.entity'
import { RoleVO } from './vo'

@Injectable()
export class RoleService implements IRoleService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createRoleDTO: CreateRoleDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { name, code, parentId, remark } = createRoleDTO

      const [hasName, hasCode] = await Promise.all([
        entityManager.findOne(RoleEntity, { where: { name } }),
        entityManager.findOne(RoleEntity, { where: { code } }),
      ])

      // const role = await entityManager.save(RoleEntity, newRole)
      const VO = new RoleVO()
      return VO
    })
  }
}
