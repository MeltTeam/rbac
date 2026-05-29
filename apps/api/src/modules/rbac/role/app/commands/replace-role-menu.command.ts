import type { ReplaceRoleMenuDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 替换角色的菜单(全量替换)Command */
export class ReplaceRoleMenuCommand extends Command<never[]> {
  constructor(public readonly replaceRoleMenuDTO: ReplaceRoleMenuDTO) {
    super()
  }
}
