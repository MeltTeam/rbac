import type { Plugin } from 'vue'
/** 拦截器 */
export const interceptor: UniNamespace.InterceptorOptions = {
  invoke(_result) {
    // 页面跳转前先鉴权
  },
  fail(err) {
    console.error(err)
  },
}
/** 路由插件 */
export const routerPlugin: Plugin = {
  install(_app, ..._options) {
    // 关于路由的api
    const routerApiName = ['navigateTo', 'reLaunch', 'redirectTo', 'switchTab']
    routerApiName.forEach((apiName) => {
      uni.addInterceptor(apiName, interceptor)
    })
  },
}
