/**
 * 登录页缓存管理
 * 用于在登录/注册/重置密码页面之间保持表单状态
 * 登录成功后清除
 */
export const loginCacheStore = defineStore('LOGIN_CACHE', {
  state: () => ({
    /** 缓存的组件名称列表 */
    cache: [] as string[],
  }),
  actions: {
    addCache(name: string) {
      if (name && !this.cache.includes(name)) {
        this.cache = [...this.cache, name]
      }
    },
    /** 登录成功后调用，清除所有登录页缓存 */
    clear() {
      this.cache = []
    },
  },
})
