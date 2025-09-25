import type { MenuEntity } from '../entities/menu.entity'

export class MenuVO {
  constructor(menu?: MenuEntity) {
    if (menu) {
      console.warn(menu)
    }
  }
}
