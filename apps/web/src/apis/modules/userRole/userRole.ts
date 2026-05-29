import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 批量替换用户的角色(全量替换) replaceUsersRole POST /v1/user-role/batch-replace */
export function replaceUsersRole({
  body,
  options,
}: {
  body: API.ReplaceUsersRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.ReplaceUsersRoleDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/user-role/batch-replace', {
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

/** 替换用户的角色(全量替换) replaceUserRole POST /v1/user-role/replace */
export function replaceUserRole({
  body,
  options,
}: {
  body: API.ReplaceUserRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.ReplaceUserRoleDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/user-role/replace', {
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

/** 获取用户的角色ID列表 getRoleByUser GET /v1/user-role/role-ids/${param0} */
export function getRoleByUser({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetRoleByUserParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetRoleByUserParams,
    API.ResVO & {
      data?: API.RoleIdsVO
    }
  >(`/v1/user-role/role-ids/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取角色的用户ID列表 getUserByRole GET /v1/user-role/user-ids/${param0} */
export function getUserByRole({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetUserByRoleParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetUserByRoleParams,
    API.ResVO & {
      data?: API.UserIdsVO
    }
  >(`/v1/user-role/user-ids/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
