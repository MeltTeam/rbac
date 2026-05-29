import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { UserRoleService } from '../services'
import { ReplaceUserRoleCommand } from './replace-user-role.command'

/** 替换用户的角色(全量替换)Handler */
@CommandHandler(ReplaceUserRoleCommand)
export class ReplaceUserRoleHandler implements ICommandHandler<ReplaceUserRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: ReplaceUserRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { id, roleIds } = command.replaceUserRoleDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.userRoleService.replaceUsersRoleByIds(em, { ids: [id], roleIds }, by)
      return []
    })
  }
}
