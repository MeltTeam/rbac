import type { RouteRecordRaw } from 'vue-router'
import { homeRoutes } from './modules/Home'
import { loginRoutes } from './modules/Login'

export const staticRoutes: RouteRecordRaw[] = [...loginRoutes, ...homeRoutes]
