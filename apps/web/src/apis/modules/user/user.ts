import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取用户列表 getUsers GET /v1/user */
export function getUsers({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetUsersParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetUsersParams,
    API.ResVO & {
      data?: API.FindAllUserVO
    }
  >('/v1/user', {
    method: 'GET',
    params: {
      ...params,
    },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 创建用户 createUser POST /v1/user */
export function createUser({
  body,
  options,
}: {
  body: API.CreateUserDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.CreateUserDTO,
    API.ResVO & {
      data?: API.UserDetailsVO
    }
  >('/v1/user', {
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

/** 查看单个用户详情 getUserById GET /v1/user/${param0} */
export function getUserById({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetUserByIdParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetUserByIdParams,
    API.ResVO & {
      data?: API.UserDetailsVO
    }
  >(`/v1/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 删除用户 deleteUser DELETE /v1/user/${param0} */
export function deleteUser({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.DeleteUserParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.DeleteUserParams,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新用户 updateUser PATCH /v1/user/${param0} */
export function updateUser({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateUserParams
  body: API.UpdateUserDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateUserDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/user/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新用户排序优先级 updateUserSort PATCH /v1/user/${param0}/sort */
export function updateUserSort({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateUserSortParams
  body: API.UpdateSortDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateSortDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/user/${param0}/sort`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新用户状态 updateUserStatus PATCH /v1/user/${param0}/status */
export function updateUserStatus({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateUserStatusParams
  body: API.UpdateStatusDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateStatusDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/user/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
