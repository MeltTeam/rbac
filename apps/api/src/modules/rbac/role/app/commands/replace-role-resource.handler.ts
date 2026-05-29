import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleResourceService } from '../services'
import { ReplaceRoleResourceCommand } from './replace-role-resource.command'

/** 替换角色的资源(全量替换)Handler */
@CommandHandler(ReplaceRoleResourceCommand)
export class ReplaceRoleResourceHandler implements ICommandHandler<ReplaceRoleResourceCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleResourceService: RoleResourceService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: ReplaceRoleResourceCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { id, resourceIds } = command.replaceRoleResourceDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleResourceService.replaceRolesResourceByIds(em, { ids: [id], resourceIds }, by)
      return []
    })
  }
}
