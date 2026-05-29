import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 批量替换角色的资源(全量替换) replaceRolesResource POST /v1/role-resource/batch-replace */
export function replaceRolesResource({
  body,
  options,
}: {
  body: API.ReplaceRolesResourceDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.ReplaceRolesResourceDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role-resource/batch-replace', {
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

/** 替换角色的资源(全量替换) replaceRoleResource POST /v1/role-resource/replace */
export function replaceRoleResource({
  body,
  options,
}: {
  body: API.ReplaceRoleResourceDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.ReplaceRoleResourceDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/role-resource/replace', {
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

/** 获取角色的资源ID列表 getResourceByRole GET /v1/role-resource/resource-ids/${param0} */
export function getResourceByRole({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetResourceByRoleParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetResourceByRoleParams,
    API.ResVO & {
      data?: API.ResourceIdsVO
    }
  >(`/v1/role-resource/resource-ids/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取资源的角色ID列表 getRoleByResource GET /v1/role-resource/role-ids/${param0} */
export function getRoleByResource({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetRoleByResourceParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetRoleByResourceParams,
    API.ResVO & {
      data?: API.RoleIdsVO
    }
  >(`/v1/role-resource/role-ids/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
