import type { IMenuService } from './IMenu'
import { Injectable } from '@nestjs/common'
import { MenuVO } from './vo'

@Injectable()
export class MenuService implements IMenuService {
  async create() {
    const VO = new MenuVO()
    return VO
  }
}
