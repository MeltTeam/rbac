import type { IMeInfoVO } from '@packages/types'
import type { MenuRouteVO } from '@/modules/rbac/menu/app'
import type { UserEntity } from '@/modules/rbac/user/domain'
import { ApiSchema } from '@nestjs/swagger'
import { MenuTypeEnum } from '@packages/types'
import { UserDetailsVO } from '@/modules/rbac/user/app'

/** 当前登录用户信息 */
@ApiSchema({ description: '当前登录用户信息' })
export class MeInfoVO extends UserDetailsVO implements IMeInfoVO {
  /**
   * 角色编码
   * @example []
   */
  roles: string[]
  /**
   * 菜单编码
   * @example []
   */
  menus: string[]
  /**
   * 菜单路由
   * @example []
   */
  routes: MenuRouteVO[]
  /**
   * 按钮编码
   * @example []
   */
  btns: string[]
  /**
   * 组件编码
   * @example []
   */
  comps: string[]
  constructor(user?: UserEntity, routes: MenuRouteVO[] = []) {
    super(user)
    this.routes = routes
    if (user) {
      const { roles } = user
      this.roles = roles.map((r) => r.roleCode)
      this.menus = [
        ...new Set(
          roles.flatMap((r) =>
            r.menus
              .filter(
                (m) =>
                  m.menuType === MenuTypeEnum.MENU ||
                  m.menuType === MenuTypeEnum.DIRECTORY ||
                  m.menuType === MenuTypeEnum.INNER_LINK ||
                  m.menuType === MenuTypeEnum.LINK,
              )
              .map((m) => m.menuCode),
          ),
        ),
      ]
      this.btns = [...new Set(roles.flatMap((r) => r.menus.filter((m) => m.menuType === MenuTypeEnum.BUTTON).map((m) => m.menuCode)))]
      this.comps = [...new Set(roles.flatMap((r) => r.menus.filter((m) => m.menuType === MenuTypeEnum.COMPONENT).map((m) => m.menuCode)))]
    }
  }
}
