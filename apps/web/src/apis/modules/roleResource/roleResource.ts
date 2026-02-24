import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 给角色分配资源 POST /v1/role/resource */
export function v1RoleResourcePost({
  body,
  options,
}: {
  body: API.AssignRoleResourceDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.AssignRoleResourceDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role/resource', {
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

/** 获取角色的资源ID列表 GET /v1/role/resource/${param0}/resource-ids */
export function v1RoleResourceIdResourceidsGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleResourceIdResourceidsGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleResourceIdResourceidsGetParams,
    API.ResVO & {
      data?: API.ResourceIdsVO
    }
  >(`/v1/role/resource/${param0}/resource-ids`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取资源的角色ID列表 GET /v1/role/resource/${param0}/role-ids */
export function v1RoleResourceIdRoleidsGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleResourceIdRoleidsGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleResourceIdRoleidsGetParams,
    API.ResVO & {
      data?: API.RoleIdsVO
    }
  >(`/v1/role/resource/${param0}/role-ids`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 批量给角色分配资源 POST /v1/role/resource/batch */
export function v1RoleResourceBatchPost({
  body,
  options,
}: {
  body: API.AssignRolesResourceDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.AssignRolesResourceDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role/resource/batch', {
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
