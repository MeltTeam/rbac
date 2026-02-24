import type { Plugin } from 'vue'
/** 拦截器 */
export const interceptor: UniNamespace.InterceptorOptions = {
  invoke(_result) {
    // 相当于axios请求拦截器
  },
  fail(err) {
    // 相当于axios异常拦截器
    console.error(err)
  },
  success(_result) {
    // 相当于axios响应拦截器
  },
}
/** 请求插件 */
export const apiPlugin: Plugin = {
  install(_app, ..._options) {
    // 关于请求的api
    const routerApiName = ['request']
    routerApiName.forEach((apiName) => {
      uni.addInterceptor(apiName, interceptor)
    })
  },
}
