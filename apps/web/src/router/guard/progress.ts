import type { Router } from 'vue-router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
/**
 * 页面路由切换进度条守卫
 * @param router 路由实例
 */
function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    nProgress?.start()
  })
  router.afterEach(() => {
    nProgress?.done()
  })
}
export { createProgressGuard, nProgress }
