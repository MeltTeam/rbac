import type { IMenuRouteVO } from '@packages/types'
import type { MenuEntity } from '../../domain'
import type { MenuRouteMetaVO } from './menu-route-meta.vo'
import { ApiSchema } from '@nestjs/swagger'
import { MenuVOAssembler } from '../assemblers'

/** 菜单路由 */
@ApiSchema({ description: '菜单路由' })
export class MenuRouteVO implements IMenuRouteVO {
  /**
   * 路由名
   * @example '路由名'
   */
  name?: string
  /**
   * 路由名
   * @example '路由名'
   */
  path: string
  /**
   * 路由名
   * @example '路由名'
   */
  alias?: string
  /**
   * 路由名
   * @example '路由名'
   */
  component: string
  /**
   * 路由名
   * @example '路由名'
   */
  redirect?: string
  /**
   * 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON)
   * @example '{redirect:"/login"}'
   */
  query?: string
  /**
   * 路由元数据
   */
  meta: MenuRouteMetaVO
  /**
   * 子路由
   * @example []
   */
  children?: MenuRouteVO[]
  constructor(menu?: MenuEntity) {
    if (menu) {
      this.name = menu.name
      this.path = menu.path || ''
      this.alias = menu.alias || void 0
      this.component = menu.component
      this.redirect = menu.redirect || void 0
      this.query = menu.query || void 0
      this.meta = MenuVOAssembler.toRouteMetaVO(menu)
    }
    this.children = []
  }
}
