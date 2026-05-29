import type { ReplaceUserRoleDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 替换用户的角色(全量替换)Command */
export class ReplaceUserRoleCommand extends Command<never[]> {
  constructor(public readonly replaceUserRoleDTO: ReplaceUserRoleDTO) {
    super()
  }
}
