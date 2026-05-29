import type { ReplaceRolesResourceDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 批量替换角色的资源(全量替换)Command */
export class ReplaceRolesResourceCommand extends Command<never[]> {
  constructor(public readonly replaceRolesResourceDTO: ReplaceRolesResourceDTO) {
    super()
  }
}
