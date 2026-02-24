import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 给角色分配菜单 POST /v1/role/menu */
export function v1RoleMenuPost({
  body,
  options,
}: {
  body: API.AssignRoleMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.AssignRoleMenuDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role/menu', {
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

/** 获取角色的菜单ID列表 GET /v1/role/menu/${param0}/menu-ids */
export function v1RoleMenuIdMenuidsGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleMenuIdMenuidsGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleMenuIdMenuidsGetParams,
    API.ResVO & {
      data?: API.MenuIdsVO
    }
  >(`/v1/role/menu/${param0}/menu-ids`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取菜单的角色ID列表 GET /v1/role/menu/${param0}/role-ids */
export function v1RoleMenuIdRoleidsGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleMenuIdRoleidsGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleMenuIdRoleidsGetParams,
    API.ResVO & {
      data?: API.RoleIdsVO
    }
  >(`/v1/role/menu/${param0}/role-ids`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 批量给角色分配菜单 POST /v1/role/menu/batch */
export function v1RoleMenuBatchPost({
  body,
  options,
}: {
  body: API.AssignRolesMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.AssignRolesMenuDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role/menu/batch', {
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
