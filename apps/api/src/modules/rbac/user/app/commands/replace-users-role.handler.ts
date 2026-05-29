import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { UserRoleService } from '../services'
import { ReplaceUsersRoleCommand } from './replace-users-role.command'

/** 批量替换用户的角色(全量替换)Handler */
@CommandHandler(ReplaceUsersRoleCommand)
export class ReplaceUsersRoleHandler implements ICommandHandler<ReplaceUsersRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: ReplaceUsersRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.userRoleService.replaceUsersRoleByIds(em, command.replaceUsersRoleDTO, by)
      return []
    })
  }
}
