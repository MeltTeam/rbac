import type { RouteRecordRaw } from 'vue-router'

export const homeRoutes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/layout/DefaultLayout.vue'),
    redirect: '/workspace',
    children: [
      {
        name: 'Workspace',
        path: 'workspace',
        component: () => import('@/views/Workspace/index.vue'),
        meta: {
          title: '工作台',
        },
      },
      {
        name: 'Test',
        path: 'test',
        component: () => import('@/views/Test/index.vue'),
        meta: {
          title: '测试',
        },
      },
    ],
  },
]
