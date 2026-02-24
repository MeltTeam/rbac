import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 给用户分配角色 POST /v1/user/role */
export function v1UserRolePost({
  body,
  options,
}: {
  body: API.AssignUserRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.AssignUserRoleDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/user/role', {
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

/** 获取用户的角色ID列表 GET /v1/user/role/${param0}/role-ids */
export function v1UserRoleIdRoleidsGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1UserRoleIdRoleidsGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1UserRoleIdRoleidsGetParams,
    API.ResVO & {
      data?: API.RoleIdsVO
    }
  >(`/v1/user/role/${param0}/role-ids`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取角色的用户ID列表 GET /v1/user/role/${param0}/user-ids */
export function v1UserRoleIdUseridsGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1UserRoleIdUseridsGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1UserRoleIdUseridsGetParams,
    API.ResVO & {
      data?: API.UserIdsVO
    }
  >(`/v1/user/role/${param0}/user-ids`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 批量给用户分配角色 POST /v1/user/role/batch */
export function v1UserRoleBatchPost({
  body,
  options,
}: {
  body: API.AssignUsersRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.AssignUsersRoleDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/user/role/batch', {
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
