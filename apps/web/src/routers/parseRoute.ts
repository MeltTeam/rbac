import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { MenuRouteVO } from '@/apis'
import { getLayoutsModule, getViewModule } from './modules'

/**
 * 解析路由配置
 * 将后端返回的路由配置转换为 Vue Router 的 RouteRecordRaw
 */
export function parseRoute(route: MenuRouteVO): RouteRecordRaw {
  let props: Record<string, unknown> | boolean = false
  if (route.query) {
    try {
      props = JSON.parse(route.query)
    } catch {
      console.warn(`[parseRoute] Invalid query JSON for route "${route.name}":`, route.query)
      props = false
    }
  }
  let component: null | RouteRecordRaw['component'] = null
  const code = route.meta.code
  if (code) {
    switch (code.split(':')[0]) {
      case 'MENU':
        component = getViewModule(route.component)
        break
      case 'DIRECTORY':
        component = getLayoutsModule(route.component)
        break
      default:
        component = null
    }
  }
  return {
    name: route.name,
    path: route.path,
    component,
    props,
    meta: route.meta as unknown as RouteMeta,
    children: route.children ? route.children?.map(parseRoute) : [],
  }
}
