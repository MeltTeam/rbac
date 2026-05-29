import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { DEFAULT_ROLES, RoleDomainService } from '@/modules/rbac/role/domain'
import { UserRoleService } from '@/modules/rbac/user/app'
import { UserDomainService } from '@/modules/rbac/user/domain'
import { RegisterCommand } from './register.command'

/** 注册Handler */
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userDomainService: UserDomainService,
    private readonly roleDomainService: RoleDomainService,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: RegisterCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const { createUserDTO } = command
      const [[user], [userRole]] = await Promise.all([
        this.userDomainService.createUsers(em, [createUserDTO], by),
        this.roleDomainService.getRolesByCodes([DEFAULT_ROLES.USER.roleCode], false, em),
      ])
      // 默认普通用户角色
      await this.userRoleService.replaceUsersRoleByIds(em, { ids: [user.id], roleIds: [userRole.id] }, by)
      return []
    })
  }
}
