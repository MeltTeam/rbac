import type { Router } from 'vue-router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const isRouterLoading = ref<boolean>(true)
/**
 * 页面路由切换进度条守卫
 * @param router 路由实例
 */
function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    isRouterLoading.value = true
    nProgress?.start()
  })
  router.afterEach(async () => {
    await nextTick(() => {
      ok()
    })
  })
}
function ok() {
  nProgress?.done()
  isRouterLoading.value = false
}
export { createProgressGuard, isRouterLoading, ok }
