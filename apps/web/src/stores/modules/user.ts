import type { EmailCaptchaDTO, EmailLoginDTO, EmailRegisterDTO, EmailResetPwdDTO, RefreshTokenDTO, SvgLoginDTO, UserDetailsVO } from '@/apis'
import {
  emailCaptcha as captchaEmail,
  svgCaptcha as captchaSvg,
  emailLogin as loginEmail,
  svgLogin as loginSvg,
  getMeInfo as me,
  refreshToken as refresh,
  emailRegister as registerEmail,
  emailResetPwd as resetPwdEmail,
} from '@/apis'
import { dynamicRouteRegistry } from '@/routers/registry'
import { unifiedLogout } from '@/utils/logout.util'
import { resetTokenPluginState } from '@/utils/http/plugins/token'
import { loginCacheStore } from './loginCache'
import { permStore } from './perm'

export const REFRESH_KEY = 'REFRESH'
export interface IUserState {
  /** 用户信息 */
  _userInfo: UserDetailsVO | null
  /** 访问令牌 */
  _access: string | null
  /** 刷新令牌 */
  _refresh: string | null
}

export const userStore = defineStore('USER', {
  state: (): IUserState => ({
    _userInfo: null,
    _access: null,
    _refresh: null,
  }),
  getters: {
    userInfo: (state) => state._userInfo,
    access: (state) => state._access,
    refresh: (state) => {
      if (state._refresh) return state._refresh
      if (typeof localStorage === 'undefined') return null
      return localStorage.getItem(REFRESH_KEY)
    },
  },
  actions: {
    setUserInfo(userInfo: UserDetailsVO | null) {
      this._userInfo = userInfo
    },
    setAccess(access: string | null) {
      this._access = access
    },
    setRefresh(refresh: string | null) {
      this._refresh = refresh
      refresh && localStorage.setItem(REFRESH_KEY, refresh)
    },
    /** 获取当前登录用户信息 */
    async getMeInfo() {
      const perm = permStore()
      const res = await me({})
      const { code, data } = res
      if (code === '0') {
        this.setUserInfo(data)
        perm.setRoles(data.roles || [])
        perm.setMenus(data.menus || [])
        perm.setBtns(data.btns || [])
        perm.setComps(data.comps || [])
        dynamicRouteRegistry.addRoutes(data.routes || [])
        // 登录成功后清除登录页缓存
        loginCacheStore().clear()
      }
      return res
    },
    /** 统一刷新令牌 */
    async refreshToken(DTO: RefreshTokenDTO) {
      const res = await refresh({ body: DTO })
      const { code, data } = res
      if (code === '0') {
        this.setAccess(data.accessToken)
        data.refreshToken && this.setRefresh(data.refreshToken)
      }
      return res
    },
    /** 统一登录 */
    async login(type: 'svg' | 'email', DTO: SvgLoginDTO | EmailLoginDTO) {
      let res = null
      switch (type) {
        case 'svg':
          res = await loginSvg({ body: DTO as SvgLoginDTO })
          break
        case 'email':
          res = await loginEmail({ body: DTO as EmailLoginDTO })
          break
      }
      const { code, data } = res
      if (code === '0') {
        this.setAccess(data.accessToken)
        data.refreshToken && this.setRefresh(data.refreshToken)
        // 登录成功后重置 TokenPlugin 状态
        resetTokenPluginState()
      }
      return res
    },
    /** 统一登出 */
    async logOut() {
      ElMessage({ message: '登出成功', type: 'success', duration: 1000 })
      await unifiedLogout()
    },
    /** 是否登录 */
    async isLoggedIn() {
      if (this.access) return true
      await this.refreshToken({ refreshToken: this.refresh || undefined }).catch(() => null)
      if (this.access) return true
      return false
    },
    reset() {
      localStorage.removeItem(REFRESH_KEY)
      this.$reset()
    },
    /** 发送邮件验证码 */
    async emailCode(name: 'test' | 'register' | 'login' | 'resetPwd' | 'updateInfo', DTO: EmailCaptchaDTO) {
      return await captchaEmail({
        params: { name },
        body: DTO,
        options: {
          requestIdRules: 'METHOD_URL',
          customConfig: {
            LimitPlugin: {
              enabled: true,
              limitTime: 2000,
              persist: true,
            },
          },
        },
      })
    },
    /** SVG验证码 */
    async svgCode(name: 'test' | 'register' | 'login' | 'resetPwd' | 'updateInfo') {
      return await captchaSvg({
        params: { name },
        options: {
          requestIdRules: 'METHOD_URL',
          customConfig: {
            LimitPlugin: {
              enabled: true,
              limitTime: 2000,
              persist: true,
            },
          },
        },
      })
    },
    /** 注册 */
    async register(type: 'email', DTO: EmailRegisterDTO) {
      switch (type) {
        case 'email':
          return await registerEmail({ body: DTO })
        default:
          throw new Error('不支持的注册类型')
      }
    },
    /** 重置密码 */
    async resetPwd(type: 'email', DTO: EmailResetPwdDTO) {
      switch (type) {
        case 'email':
          return await resetPwdEmail({ body: DTO })
        default:
          throw new Error('不支持的重置密码类型')
      }
    },
  },
})
