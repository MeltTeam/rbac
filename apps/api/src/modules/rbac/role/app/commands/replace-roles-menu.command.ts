import type { ReplaceRolesMenuDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 批量替换角色的菜单(全量替换)Command */
export class ReplaceRolesMenuCommand extends Command<never[]> {
  constructor(public readonly replaceRolesMenuDTO: ReplaceRolesMenuDTO) {
    super()
  }
}
