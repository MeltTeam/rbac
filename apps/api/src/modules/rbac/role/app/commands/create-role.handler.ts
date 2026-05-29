import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleDomainService } from '../../domain'
import { RoleVOAssembler } from '../assemblers'
import { CreateRoleCommand } from './create-role.command'

/** 创建角色Handler */
@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleDomainService: RoleDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: CreateRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const [role] = await this.roleDomainService.createRoles(em, [command.createRoleDTO], by)
      return RoleVOAssembler.toDetailsVO(role)
    })
  }
}
