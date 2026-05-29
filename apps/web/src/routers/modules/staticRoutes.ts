import type { RouteRecordRaw } from 'vue-router'
import { getLayoutsModule, getViewModule } from './dynamicRoutes'

/** 静态路由 */
export const STATIC_ROUTES: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: getLayoutsModule('/DefaultLayout/index'),
    redirect: { name: 'Dashboard' },
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: getViewModule('/Dashboard/index'),
        meta: {
          title: 'pages.Dashboard.title',
          icon: 'icon-park-outline:background-color',
          isCache: true,
          isVisible: true,
          isRefresh: true,
        },
      },
      {
        name: 'ColorPalette',
        path: 'color-palette',
        component: getViewModule('/ColorPalette/index'),
        meta: {
          title: 'pages.ColorPalette.title',
          icon: 'icon-park-outline:background-color',
          isCache: true,
          isVisible: true,
          isRefresh: true,
        },
      },
      {
        name: 'Test',
        path: 'test',
        component: getViewModule('/Test/index'),
        meta: {
          title: 'pages.Test.title',
          icon: 'icon-park-outline:background-color',
          isCache: true,
          isVisible: true,
          isRefresh: true,
          code: 'dashboard',
        },
      },
      // {
      //   name: 'Menu',
      //   path: 'menu',
      //   component: getViewModule('/Menu/index'),
      //   meta: {
      //     title: 'pages.Menu.title',
      //     icon: 'icon-park-outline:background-color',
      //     isCache: true,
      //     isVisible: true,
      //     isRefresh: true,
      //     code: 'menu',
      //   },
      // },
      {
        name: 'Forbidden',
        path: '403',
        component: getViewModule('/Error/403'),
        meta: {
          title: 'pages.Error.Forbidden.title',
          isWhite: true,
        },
      },
      {
        name: 'NotFound',
        path: '404',
        component: getViewModule('/Error/404'),
        meta: {
          title: 'pages.Error.NotFound.title',
          isWhite: true,
        },
      },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: getLayoutsModule('/LoginLayout/index'),
    redirect: { name: 'SvgLogin' },
    meta: { isWhite: true },
    children: [
      {
        name: 'SvgLogin',
        path: 'svg-login',
        component: getViewModule('/Login/SvgLogin/index'),
        meta: {
          title: 'pages.Login.SvgLogin.title',
          isCache: true,
          isWhite: true,
        },
      },
      {
        name: 'EmailLogin',
        path: 'email-login',
        component: getViewModule('/Login/EmailLogin/index'),
        meta: {
          title: 'pages.Login.EmailLogin.title',
          isWhite: true,
        },
      },
      {
        name: 'EmailRegister',
        path: 'email-register',
        component: getViewModule('/Login/EmailRegister/index'),
        meta: {
          title: 'pages.Login.EmailRegister.title',
          isCache: true,
          isWhite: true,
        },
      },
      {
        name: 'ResetPwd',
        path: 'reset-pwd',
        component: getViewModule('/Login/ResetPwd/index'),
        meta: {
          title: 'pages.Login.ResetPwd.title',
          isCache: true,
          isWhite: true,
        },
      },
    ],
  },
]
/** 未知路由 */
export const UNKNOWN_ROUTE = {
  name: 'Unknown',
  path: '/:path(.*)*',
  redirect: { name: 'NotFound' },
  meta: {
    isWhite: true,
  },
}
