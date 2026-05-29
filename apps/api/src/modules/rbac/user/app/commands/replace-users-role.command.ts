import type { ReplaceUsersRoleDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 批量替换用户的角色(全量替换)Command */
export class ReplaceUsersRoleCommand extends Command<never[]> {
  constructor(public readonly replaceUsersRoleDTO: ReplaceUsersRoleDTO) {
    super()
  }
}
