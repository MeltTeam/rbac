import type { CreateMenuDTO } from '../dto'
import type { MenuDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 创建菜单Command */
export class CreateMenuCommand extends Command<MenuDetailsVO> {
  constructor(public readonly createMenuDTO: CreateMenuDTO) {
    super()
  }
}
