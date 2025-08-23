import type { RouteRecordRaw } from 'vue-router'

export const LOGIN_KEEP_ALIVE = ['SvgLogin', 'EmailLogin', 'EmailRegister', 'ResetPwd']
export const loginRoutes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/layout/LoginLayout.vue'),
    redirect: '/login/svg-login',
    children: [
      {
        name: 'SvgLogin',
        path: 'svg-login',
        component: () => import('@/views/Login/SvgLogin/index.vue'),
        meta: {
          title: 'views.Login.SvgLogin.title',
        },
      },
      {
        name: 'EmailLogin',
        path: 'email-login',
        component: () => import('@/views/Login/EmailLogin/index.vue'),
        meta: {
          title: 'views.Login.EmailLogin.title',
        },
      },
      {
        name: 'EmailRegister',
        path: 'email-register',
        component: () => import('@/views/Login/EmailRegister/index.vue'),
        meta: {
          title: 'views.Login.EmailRegister.title',
        },
      },
      {
        name: 'ResetPwd',
        path: 'reset-pwd',
        component: () => import('@/views/Login/ResetPwd/index.vue'),
        meta: {
          title: 'views.Login.ResetPwd.title',
        },
      },
    ],
  },
]
