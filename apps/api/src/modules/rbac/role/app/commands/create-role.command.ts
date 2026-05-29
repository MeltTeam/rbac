import type { CreateRoleDTO } from '../dto'
import type { RoleDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 创建角色Command */
export class CreateRoleCommand extends Command<RoleDetailsVO> {
  constructor(public readonly createRoleDTO: CreateRoleDTO) {
    super()
  }
}
