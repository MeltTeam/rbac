import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleResourceService } from '../services'
import { ReplaceRolesResourceCommand } from './replace-roles-resource.command'

/** 批量替换角色的资源(全量替换)Handler */
@CommandHandler(ReplaceRolesResourceCommand)
export class ReplaceRolesResourceHandler implements ICommandHandler<ReplaceRolesResourceCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleResourceService: RoleResourceService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: ReplaceRolesResourceCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleResourceService.replaceRolesResourceByIds(em, command.replaceRolesResourceDTO, by)
      return []
    })
  }
}
