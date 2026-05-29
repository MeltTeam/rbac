import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleMenuService } from '../services'
import { ReplaceRolesMenuCommand } from './replace-roles-menu.command'

/** 批量替换角色的菜单(全量替换)Handler */
@CommandHandler(ReplaceRolesMenuCommand)
export class ReplaceRolesMenuHandler implements ICommandHandler<ReplaceRolesMenuCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleMenuService: RoleMenuService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: ReplaceRolesMenuCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleMenuService.replaceRolesMenuByIds(em, command.replaceRolesMenuDTO, by)
      return []
    })
  }
}
