import type { MenuEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { CheckEnum, IMenuRouteMetaVO } from '@packages/types'

/** 菜单路由元数据 */
@ApiSchema({ description: '菜单路由元数据' })
export class MenuRouteMetaVO implements IMenuRouteMetaVO {
  /**
   * 标题(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example '用户管理'
   */
  title?: string
  /**
   * 图标地址(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example 'https://www.icon.com'
   */
  icon?: string
  /**
   * 是否缓存(MENU,COMPONENT,INNER_LINK)
   * @example true
   */
  isCache: boolean
  /**
   * 是否隐藏(MENU)
   * @example true
   */
  isVisible: boolean
  /**
   * 是否刷新(MENU)
   * @example true
   */
  isRefresh: boolean
  /**
   * 菜单编码
   * @example 'TEST'
   */
  code: string
  constructor(menu?: MenuEntity) {
    if (menu) {
      const { title, icon, isCache, isVisible, isRefresh, menuCode } = menu
      if (title) this.title = title
      if (icon) this.icon = icon
      this.isCache = isCache === CheckEnum.TRUE
      this.isVisible = isVisible === CheckEnum.TRUE
      this.isRefresh = isRefresh === CheckEnum.TRUE
      this.code = menuCode
    }
  }
}
