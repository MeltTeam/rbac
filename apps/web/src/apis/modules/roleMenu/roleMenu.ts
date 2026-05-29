import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 批量替换角色的菜单(全量替换) replaceRolesMenu POST /v1/role-menu/batch-replace */
export function replaceRolesMenu({
  body,
  options,
}: {
  body: API.ReplaceRolesMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.ReplaceRolesMenuDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role-menu/batch-replace', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取角色的菜单ID列表 getMenuByRole GET /v1/role-menu/menu-ids/${param0} */
export function getMenuByRole({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetMenuByRoleParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetMenuByRoleParams,
    API.ResVO & {
      data?: API.MenuIdsVO
    }
  >(`/v1/role-menu/menu-ids/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 替换角色的菜单(全量替换) replaceRoleMenu POST /v1/role-menu/replace */
export function replaceRoleMenu({
  body,
  options,
}: {
  body: API.ReplaceRoleMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.ReplaceRoleMenuDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role-menu/replace', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取菜单的角色ID列表 getRoleByMenu GET /v1/role-menu/role-ids/${param0} */
export function getRoleByMenu({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetRoleByMenuParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetRoleByMenuParams,
    API.ResVO & {
      data?: API.RoleIdsVO
    }
  >(`/v1/role-menu/role-ids/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
