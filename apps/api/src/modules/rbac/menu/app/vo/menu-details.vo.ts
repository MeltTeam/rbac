import type { CheckEnum } from '@packages/types'
import type { MenuEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { IMenuDetailsVO, MenuTypeEnum } from '@packages/types'
import { omit } from 'lodash-es'
import { BaseVO } from '@/common/vo'

/** 菜单详情 */
@ApiSchema({ description: '菜单详情' })
export class MenuDetailsVO extends BaseVO implements IMenuDetailsVO {
  /**
   * 父菜单ID
   * @example '父菜单ID'
   */
  parentId: string | null
  /**
   * 菜单ID
   * @example 'xxx'
   */
  id: string
  /**
   * 菜单名
   * @example '菜单名'
   */
  name: string
  /**
   * 菜单编码(菜单类型:领域:操作类型)
   * @example 'MENU:USER:MANAGEMENT'
   */
  menuCode: string
  /**
   * 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链)
   * @example 10
   */
  menuType: MenuTypeEnum
  /**
   * 菜单领域
   * @example 'USER'
   */
  domain: string
  /**
   * 菜单操作类型
   * @example 'MANAGEMENT'
   */
  action: string
  /**
   * 访问路径(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example '/user'
   */
  path: string | null
  /**
   * 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON)
   * @example '["users"]'
   */
  alias: string | null
  /**
   * 组件路径
   * @example 'src/views/userView/index'
   */
  component: string
  /**
   * 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON)
   * @example '{name:"user"}'
   */
  redirect: string | null
  /**
   * 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON)
   * @example '{redirect:"/login"}'
   */
  query: string | null
  /**
   * 标题(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example '用户管理'
   */
  title: string | null
  /**
   * 图标地址(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example 'https://www.icon.com'
   */
  icon: string | null
  /**
   * 是否缓存(MENU,COMPONENT,INNER_LINK)
   * @example 10
   */
  isCache: CheckEnum
  /**
   * 是否隐藏(MENU)
   * @example 10
   */
  isVisible: CheckEnum
  /**
   * 是否刷新(MENU)
   * @example 10
   */
  isRefresh: CheckEnum

  constructor(menu?: MenuEntity) {
    super()
    if (menu) {
      const keys = ['_id', 'ancestorNodes', 'descendantNodes', 'roles']
      const omitResult = omit(menu, keys)
      Object.assign(this, omitResult)
    }
  }
}
