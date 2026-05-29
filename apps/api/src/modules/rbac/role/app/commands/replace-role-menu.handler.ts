import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleMenuService } from '../services'
import { ReplaceRoleMenuCommand } from './replace-role-menu.command'

/** 替换角色的菜单(全量替换)Handler */
@CommandHandler(ReplaceRoleMenuCommand)
export class ReplaceRoleMenuHandler implements ICommandHandler<ReplaceRoleMenuCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleMenuService: RoleMenuService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: ReplaceRoleMenuCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { id, menuIds } = command.replaceRoleMenuDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleMenuService.replaceRolesMenuByIds(em, { ids: [id], menuIds }, by)
      return []
    })
  }
}
