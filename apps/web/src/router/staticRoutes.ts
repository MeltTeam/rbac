import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'

/** 读取静态路由导入信息 */
export const staticViews = import.meta.glob('@/views/static/**/*.vue')
export const staticViewsEntries = Object.entries(staticViews)
/** 登录页需要缓存的组件名称 */
export const LOGIN_KEEP_ALIVE: string[] = []

/**
 * 获取静态路由
 * @param entries 读取静态路由导入信息
 * @param dynamicsRoutes 合并动态路由
 */
export function getStaticRoutes(entries: [string, any][], dynamicsRoutes: RouteRecordRaw[] = []) {
  const routes: RouteRecordRaw[] = []
  /** 用来缓存tree结构 */
  const treeMap = new Map<RouteRecordNameGeneric, RouteRecordRaw & { parent?: string | null }>()
  for (const [key, value] of entries) {
    const pathArray = key.replace('/src/views/static/', '').replace('.vue', '').split('/')
    // 过滤路径包含components的组件文件
    if (pathArray.findIndex((item) => item === 'components') !== -1) continue
    const last = pathArray[pathArray.length - 1]
    const _tree: RouteRecordRaw & { parent?: string | null } = {
      parent: null,
      path: last,
      name: last,
      children: [],
      component: value,
      meta: {
        hidden: true,
      },
    }
    if (last === 'index') {
      // 首页根页面处理
      if (pathArray.length === 1) {
        _tree.name = 'root'
        _tree.path = '/'
        _tree.redirect = '/login'
      }
      // 其他根页面处理
      if (pathArray.length === 2) {
        _tree.name = pathArray[pathArray.length - 2]
        _tree.path = `/${_tree.name}`
      }
      if (pathArray.length > 2) {
        _tree.parent = pathArray[pathArray.length - 3]
        _tree.name = pathArray[pathArray.length - 2]
        _tree.path = _tree.name
      }
    } else {
      _tree.parent = pathArray[pathArray.length - 2]
    }
    if (_tree.name === 'login') _tree.redirect = `${_tree.path}/SvgLogin`
    if (_tree.name === 'not-found') {
      _tree.parent = null
      _tree.path = '/:path(.*)*'
    }
    if (_tree.parent === 'login') LOGIN_KEEP_ALIVE.push(_tree.name as string)
    treeMap.set(_tree.name, _tree)
  }
  treeMap.forEach((value) => {
    if (Object.is(null, value.parent)) {
      delete value.parent
      value.path === '/' ? routes.unshift(value) : routes.push(value)
    } else {
      const parent = treeMap.get(value.parent!)
      if (parent) {
        delete value.parent
        parent.children?.push(value)
      }
    }
  })
  // 添动态路由
  if (dynamicsRoutes.length > 0) routes.push(...dynamicsRoutes)
  // 将404页面置后
  const index = routes.findIndex((route) => route.name === 'not-found')
  if (index !== -1) {
    const error = routes.splice(index, 1)[0]
    routes.push(error)
  }
  return routes
}
