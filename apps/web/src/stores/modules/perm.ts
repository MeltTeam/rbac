import { nextTick } from 'vue'
import { resetRouter } from '@/routers'

export interface IPermState {
  /** 角色编码 */
  _roles: string[]
  /** 菜单编码(页面，按钮等) */
  _menus: string[]
  /** 按钮编码 */
  _btns: string[]
  /** 组件编码 */
  _comps: string[]
}
export const permStore = defineStore('PERM', {
  state: (): IPermState => ({
    _roles: [],
    _menus: [],
    _btns: [],
    _comps: [],
  }),
  getters: {
    roles: (state) => state._roles,
    menus: (state) => state._menus,
    btns: (state) => state._btns,
    comps: (state) => state._comps,
  },
  actions: {
    isRouteG() {
      return this.menus.length > 0
    },
    hasRolesPerm(code: string) {
      return this._roles.includes(code)
    },
    hasMenusPerm(code: string) {
      return this._menus.includes(code)
    },
    hasBtnsPerm(code: string) {
      return this._btns.includes(code)
    },
    hasCompsPerm(code: string) {
      return this._comps.includes(code)
    },
    setMenus(menus: string[]) {
      this._menus = menus
    },
    setRoles(roles: string[]) {
      this._roles = roles
    },
    setBtns(btns: string[]) {
      this._btns = btns
    },
    setComps(comps: string[]) {
      this._comps = comps
    },
    reset() {
      this.$reset()
      nextTick(() => resetRouter())
    },
  },
})
