import type { EmailCaptchaDTO, EmailLoginDTO, EmailRegisterDTO, EmailResetPwdDTO, RefreshTokenDTO, SvgLoginDTO, UserDetailsVO } from '@/apis'
import {
  v1AuthEmailNamePost,
  v1AuthLoginEmailPost,
  v1AuthLoginSvgPost,
  v1AuthLogoutPost,
  v1AuthMeGet,
  v1AuthRefreshPost,
  v1AuthRegisterEmailPost,
  v1AuthResetpwdEmailPost,
  v1AuthSvgNameGet,
} from '@/apis'
import { goTo } from '@/router'

export const REFRESH_KEY = 'REFRESH'
export interface IAuthState {
  /** 用户信息 */
  _useInfo: UserDetailsVO | null
  /** 访问令牌 */
  _access: string | null
  /** 刷新令牌 */
  _refresh: string | null
  /** 角色编码 */
  _roles: string[]
  /** 菜单编码(页面，按钮等) */
  _menus: string[]
}

export const useAuth = defineStore('AUTH', {
  state: (): IAuthState => ({
    _useInfo: null,
    _access: null,
    _refresh: null,
    _roles: [],
    _menus: [],
  }),
  getters: {
    useInfo: (state) => state._useInfo,
    access: (state) => state._access,
    refresh: (state) => {
      if (state._refresh) return state._refresh
      const refresh = localStorage.getItem(REFRESH_KEY)
      state._refresh = refresh
      return refresh
    },
    roles: (state) => state._roles,
    menus: (state) => state._menus,
  },
  actions: {
    setAccess(access: string) {
      this._access = access
    },
    setRefresh(refresh: string) {
      this._refresh = refresh
      localStorage.setItem(REFRESH_KEY, refresh)
    },
    /** 获取当前登录用户信息 */
    async getMeInfo() {
      const res = await v1AuthMeGet({})
      console.warn(res)
    },
    /** 统一刷新令牌 */
    async refreshToken(DTO: RefreshTokenDTO) {
      const {
        data: { accessToken: newAccess, refreshToken: newRefresh },
      } = await v1AuthRefreshPost({ body: DTO })
      this.setAccess(newAccess)
      if (newRefresh) this.setRefresh(newRefresh)
    },
    /** 统一登录 */
    async login(type: 'svg' | 'email', DTO: SvgLoginDTO | EmailLoginDTO) {
      switch (type) {
        case 'svg':
          return await v1AuthLoginSvgPost({ body: DTO as SvgLoginDTO })
        case 'email':
          return await v1AuthLoginEmailPost({ body: DTO as EmailLoginDTO })
      }
    },
    /** 统一登出 */
    async logOut(DTO: RefreshTokenDTO) {
      try {
        await v1AuthLogoutPost({ body: DTO })
      } catch {
        // 忽略错误
      }
      this.$reset()
      localStorage.removeItem(REFRESH_KEY)
      ElMessage({ message: '登出成功', type: 'success', duration: 1000 })
      goTo('Login')
    },
    /** 发送邮件验证码 */
    async emailCode(name: 'test' | 'register' | 'login' | 'resetPwd' | 'updateInfo', DTO: EmailCaptchaDTO) {
      return await v1AuthEmailNamePost({ params: { name }, body: DTO })
    },
    /** SVG验证码 */
    async svgCode(name: 'test' | 'register' | 'login' | 'resetPwd' | 'updateInfo') {
      return await v1AuthSvgNameGet({ params: { name } })
    },
    /** 注册 */
    async register(type: 'email', DTO: EmailRegisterDTO) {
      switch (type) {
        case 'email':
          return await v1AuthRegisterEmailPost({ body: DTO })
        default:
          throw new Error('不支持的注册类型')
      }
    },
    /** 重置密码 */
    async resetPwd(type: 'email', DTO: EmailResetPwdDTO) {
      switch (type) {
        case 'email':
          return await v1AuthResetpwdEmailPost({ body: DTO })
        default:
          throw new Error('不支持的重置密码类型')
      }
    },
  },
})
