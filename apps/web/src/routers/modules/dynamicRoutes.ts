/** 布局组件 */
const layoutsModules = import.meta.glob(['@/layouts/**/*.vue', '!**/components/**'], { eager: false })
/** 页面组件 */
const pagesModules = import.meta.glob(['@/pages/**/*.vue', '!**/components/**'], { eager: false })

export function getViewModule(path: string) {
  return pagesModules[`/src/pages${path}.vue`]
}
export function getLayoutsModule(path: string) {
  return layoutsModules[`/src/layouts${path}.vue`]
}
