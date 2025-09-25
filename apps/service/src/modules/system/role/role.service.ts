import type { CreateRoleDTO, RoleCodeDTO, RoleIdDTO, RoleNameDTO } from './dto'
import type { IRoleService } from './IRole'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleBusiness } from '@packages/types'
import { EntityManager, Repository } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { RoleEntity } from './entities/role.entity'
import { RoleTreeEntity } from './entities/roleTree.entity'
import { RoleException } from './role.exception'
import { FindAllRoleVO, RoleVO } from './vo'

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleDTO: CreateRoleDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { name, roleCode, parentId, remark } = createRoleDTO

      const [hasName, hasCode, hasParentRole] = await Promise.all([
        entityManager.findOne(RoleEntity, { where: { name }, lock: { mode: 'pessimistic_write' } }),
        entityManager.findOne(RoleEntity, { where: { roleCode }, lock: { mode: 'pessimistic_write' } }),
        parentId ? entityManager.findOne(RoleEntity, { where: { id: parentId }, lock: { mode: 'pessimistic_write' } }) : null,
      ])
      if (hasName) throw new RoleException(RoleBusiness.NAME_ALREADY_EXISTS)
      if (hasCode) throw new RoleException(RoleBusiness.CODE_ALREADY_EXISTS)
      if (parentId && !hasParentRole) throw new RoleException(RoleBusiness.NOT_FOUND)

      // 创建角色
      const now = new Date()
      const newRole = entityManager.create(RoleEntity, {
        name,
        roleCode,
        parentId,
        remark,
        createdBy: by,
        createdAt: now,
        updatedBy: by,
        updatedAt: now,
      })
      const role = await entityManager.save(RoleEntity, newRole)
      // 保存关系
      const roleId = role.id
      const selfTreeRelation = entityManager.create(RoleTreeEntity, {
        ancestorId: roleId,
        descendantId: roleId,
        depth: 0,
      })
      await entityManager.save(RoleTreeEntity, selfTreeRelation)

      // 有父角色
      if (parentId) {
        const parentTreeRelations = await entityManager
          .createQueryBuilder(RoleTreeEntity, 'tree')
          .select('tree.ancestor_id', 'ancestorId')
          .addSelect('tree.depth', 'depth')
          .where('tree.descendant_id = :parentId', { parentId })
          .setLock('pessimistic_write')
          .getRawMany()

        const newTreeRelations = parentTreeRelations.map((item) => ({
          ancestorId: item.ancestorId,
          descendantId: roleId,
          depth: item.depth + 1,
        }))

        await entityManager.save(RoleTreeEntity, newTreeRelations)
      }

      const VO = new RoleVO(role)
      return VO
    })
  }

  findAll(findAllDTO: FindAllDTO, isVO: true): Promise<FindAllRoleVO>
  findAll(findAllDTO: FindAllDTO, isVO: false): Promise<[RoleEntity[], number]>
  findAll(findAllDTO: FindAllDTO): Promise<FindAllRoleVO>
  async findAll(findAllDTO: FindAllDTO, isVO: boolean = true) {
    let { limit = 10, page = 1 } = findAllDTO
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.roleRepository.findAndCount({ skip, take: limit, order: { createdAt: 'DESC' } })
    if (isVO) {
      const VO = new FindAllRoleVO({ DataConstructor: RoleVO, data, limit, page, total })
      return VO
    }
    return [data, total]
  }

  findOneById(roleIdDTO: RoleIdDTO, isVO: true): Promise<RoleVO>
  findOneById(roleIdDTO: RoleIdDTO, isVO: false): Promise<RoleEntity>
  findOneById(roleIdDTO: RoleIdDTO): Promise<RoleVO>
  async findOneById(roleIdDTO: RoleIdDTO, isVO: boolean = true) {
    const { id } = roleIdDTO
    const role = await this.roleRepository.findOne({ where: { id } })
    if (!role) throw new RoleException(RoleBusiness.NOT_FOUND)
    if (isVO) {
      const VO = new RoleVO(role)
      return VO
    }
    return role
  }

  findOneByName(roleNameDTO: RoleNameDTO, isVO: true): Promise<RoleVO>
  findOneByName(roleNameDTO: RoleNameDTO, isVO: false): Promise<RoleEntity>
  findOneByName(roleNameDTO: RoleNameDTO): Promise<RoleVO>
  async findOneByName(roleNameDTO: RoleNameDTO, isVO: boolean = true) {
    const { name } = roleNameDTO
    const role = await this.roleRepository.findOne({ where: { name } })
    if (!role) throw new RoleException(RoleBusiness.NOT_FOUND)
    if (isVO) {
      const VO = new RoleVO(role)
      return VO
    }
    return role
  }

  findOneByCode(roleCodeDTO: RoleCodeDTO, isVO: true): Promise<RoleVO>
  findOneByCode(roleCodeDTO: RoleCodeDTO, isVO: false): Promise<RoleEntity>
  findOneByCode(roleCodeDTO: RoleCodeDTO): Promise<RoleVO>
  async findOneByCode(roleCodeDTO: RoleCodeDTO, isVO: boolean = true) {
    const { roleCode } = roleCodeDTO
    const role = await this.roleRepository.findOne({ where: { roleCode } })
    if (!role) throw new RoleException(RoleBusiness.NOT_FOUND)
    if (isVO) {
      const VO = new RoleVO(role)
      return VO
    }
    return role
  }

  async updateStatusById(roleIdDTO: RoleIdDTO, updateStatusDTO: UpdateStatusDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = roleIdDTO
      const { status } = updateStatusDTO

      const role = await entityManager
        .createQueryBuilder(RoleEntity, 'r')
        .where('r.id = :id')
        .andWhere('r.deletedAt IS NULL')
        .setParameters({ id })
        .useTransaction(true)
        .setLock('pessimistic_write')
        .getOne()

      if (!role) throw new RoleException(RoleBusiness.NOT_FOUND)

      const now = new Date()
      await entityManager.update(RoleEntity, { id }, { status, updatedBy: by, updatedAt: now })

      return true
    })
  }
}
