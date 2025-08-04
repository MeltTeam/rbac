import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'
import type { PageInfo } from '@/typings/router'

// 路由配置name文件名,path全部小写
interface IRouteTree {
  /** 该路由到根路由的路径 */
  ancestorsPath: string[]
  /** 父路由 */
  parent: string | null
  /** 路由配置 */
  routerConfig: RouteRecordRaw
}
const NOT_FOUND_PATH = 'not-found'
const LOGIN_PATH = '/login'
const ROOT_NAME = 'root'
/** 所有页面额外路由信息配置 */
const PAGES_INFO: [string, PageInfo][] = Object.entries(
  import.meta.glob('@/views/**/pageInfo.ts', {
    eager: true,
    import: 'default',
  }),
)
/** 页面组件(已经过滤components目录下的vue文件) */
const PAGES_COMPONENT = Object.entries(import.meta.glob('@/views/**/*.vue')).filter((item) => isPageComponent(item[0]))
/** 路由配置 */
const routes: RouteRecordRaw[] = []
/** 用来缓存tree结构 */
const _treeMap = new Map<RouteRecordNameGeneric, IRouteTree>()
/** 初始化自动路由 */
function initAutoRoutes() {
  if (!PAGES_COMPONENT || PAGES_COMPONENT.length === 0) return []
  // 生成各个页面的默认配置
  for (const [path, fn] of PAGES_COMPONENT) {
    const pathArray = path
      .replace('/src/views/', '')
      .replace('.vue', '')
      .split('/')
      .map((item) => {
        const _item = item.toLowerCase()
        return getPath(_item).path
      })
    const lastIndex = pathArray.length - 1
    const last = pathArray[lastIndex]
    const route: IRouteTree = {
      ancestorsPath: [],
      parent: null,
      routerConfig: {
        path: '',
        children: [],
      },
    }
    const config = route.routerConfig
    switch (pathArray.length) {
      // 第一层
      case 1: {
        if (last === 'index') {
          config.path = `/`
          config.name = ROOT_NAME
          config.redirect = LOGIN_PATH
        } else {
          config.path = `/${last}`
          config.name = last
        }
        break
      }
      // 第二层
      case 2: {
        const last2 = pathArray[lastIndex - 1]
        if (last === 'index') {
          config.path = `/${last2}`
          config.name = last2
        } else {
          config.path = last
          config.name = last
          route.parent = last2
          route.ancestorsPath = pathArray.filter((item) => item !== last)
        }
        break
      }
      // 嵌套大于两层的页面
      default: {
        const last2 = pathArray[lastIndex - 1]
        const last3 = pathArray[lastIndex - 2]
        if (last === 'index') {
          const _last2 = last2
          config.path = _last2
          config.name = _last2
          route.parent = last3
          route.ancestorsPath = pathArray.filter((item) => item !== 'index' && item !== last2)
        } else {
          const _last = last
          config.path = _last
          config.name = _last
          route.parent = last2
          route.ancestorsPath = pathArray.filter((item) => item !== last)
        }
      }
    }
    config.component = fn
    !_treeMap.has(route.routerConfig.name) && _treeMap.set(route.routerConfig.name, route)
  }

  // 没有首页index.vue文件,创建一个默认首页配置
  const hasRoot = _treeMap.has(ROOT_NAME)
  if (!hasRoot) {
    _treeMap.set(ROOT_NAME, {
      ancestorsPath: [],
      parent: null,
      routerConfig: {
        name: ROOT_NAME,
        path: '/',
        redirect: LOGIN_PATH,
      },
    })
  }
  // 补全没有的父路由的配置
  _treeMap.forEach((value) => (value.parent || value.ancestorsPath.length > 0) && ensureAncestors(value.ancestorsPath))
  // 合并额外的页面配置(看pageInfo.ts是否与当前配置的path匹配,匹配就覆盖默认配置)
  for (const [path, _customConfig] of PAGES_INFO) {
    const pathArray = path.replace('/src/views', '').toLowerCase().split('/')
    const _path = pathArray[pathArray.length - 2] || ROOT_NAME
    const hasConfig = _treeMap.get(_path)
    if (hasConfig) hasConfig.routerConfig = Object.assign(hasConfig.routerConfig, _customConfig.router)
  }
  // 构建静态路由树
  _treeMap.forEach((value) => {
    const config = value.routerConfig
    if (Object.is(null, value.parent)) {
      // 没有父路由的配置
      config.path === '/' ? routes.unshift(config) : routes.push(config)
    } else {
      // 有父路由的配置
      const parent = _treeMap.get(value.parent!)
      if (parent) {
        if (!parent.routerConfig.children) parent.routerConfig.children = []
        parent.routerConfig.children?.push(config)
      }
    }
  })
  console.warn(_treeMap)
  const lastRoute: RouteRecordRaw = {
    name: 'lastRoute',
    path: '/:path(.*)*',
    redirect: `${NOT_FOUND_PATH}`,
  }
  routes.push(lastRoute)
}

function getStaticRoutes() {
  return routes.filter((item) => !item?.meta?.isDynamics)
}

function getDynamicsRoutes() {
  return routes.filter((item) => item?.meta?.isDynamics)
}

/** 是否为页面组件 */
function isPageComponent(path: string) {
  return !/\/components\//.test(path)
}

/**
 * 递归补全缺失的祖先路由
 * @param ancestorsPath 从当前路由到根的祖先路径（不含自身）
 */
function ensureAncestors(ancestorsPath: string[]) {
  for (let i = 0; i < ancestorsPath.length; i++) {
    const name = ancestorsPath[i]
    if (!_treeMap.has(name)) {
      const parent = i > 0 ? ancestorsPath[i - 1] : null
      const pathArray = ancestorsPath.slice(0, i + 1)
      const path = pathArray.length === 1 ? `/${pathArray[0]}` : pathArray[pathArray.length - 1]

      console.warn(`[路由补全] 祖先路由 "${name}" 缺失，自动创建占位路由`)

      const route: IRouteTree = {
        ancestorsPath: ancestorsPath.slice(0, i),
        parent,
        routerConfig: {
          path,
          name,
          component: () => import('./DefaultView.vue'),
          children: [],
        },
      }
      _treeMap.set(name, route)
    }
  }
}

/** 把文件/目录名转成 vue-router path 片段并收集参数名 */
function getPath(raw: string): {
  path: string
  paramNames: string[]
} {
  const paramNames: Set<string> = new Set()

  const path = raw.replace(/\[{1,2}(\w+)\]{1,2}\+?/g, (match, name: string) => {
    paramNames.add(name)
    // 拆解 match 判断是哪一种
    // [[...]]
    const optional = match.startsWith('[[')
    // ...+
    const repeatable = match.endsWith('+')
    // [[p]]+
    if (optional && repeatable) return `:${name}*`
    // [p]+
    if (!optional && repeatable) return `:${name}+`
    // [[p]]
    if (optional) return `:${name}?`
    // [p]
    return `:${name}`
  })

  return { path, paramNames: [...paramNames] }
}
export { getDynamicsRoutes, getStaticRoutes, initAutoRoutes }
