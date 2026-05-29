import type { ReplaceRoleResourceDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 替换角色的资源(全量替换)Command */
export class ReplaceRoleResourceCommand extends Command<never[]> {
  constructor(public readonly replaceRoleResourceDTO: ReplaceRoleResourceDTO) {
    super()
  }
}
