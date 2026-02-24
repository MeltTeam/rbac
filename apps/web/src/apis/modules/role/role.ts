import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取角色列表 GET /v1/role */
export function v1RoleGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleGetParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.V1RoleGetParams,
    API.ResVO & {
      data?: API.FindAllRoleVO
    }
  >('/v1/role', {
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

/** 创建角色 POST /v1/role */
export function v1RolePost({
  body,
  options,
}: {
  body: API.CreateRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.CreateRoleDTO,
    API.ResVO & {
      data?: API.RoleDetailsVO
    }
  >('/v1/role', {
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

/** 查看单个角色详情 GET /v1/role/${param0} */
export function v1RoleIdGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleIdGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleIdGetParams,
    API.ResVO & {
      data?: API.RoleDetailsVO
    }
  >(`/v1/role/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 删除角色 DELETE /v1/role/${param0} */
export function v1RoleIdDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleIdDeleteParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleIdDeleteParams,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/role/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新角色 PATCH /v1/role/${param0} */
export function v1RoleIdPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleIdPatchParams
  body: API.UpdateRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateRoleDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/role/${param0}`, {
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

/** 移动角色 PATCH /v1/role/${param0}/move */
export function v1RoleIdMovePatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleIdMovePatchParams
  body: API.MoveRoleDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.MoveRoleDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/role/${param0}/move`, {
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

/** 更新角色排序优先级 PATCH /v1/role/${param0}/sort */
export function v1RoleIdSortPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleIdSortPatchParams
  body: API.UpdateSortDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateSortDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/role/${param0}/sort`, {
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

/** 更新角色状态 PATCH /v1/role/${param0}/status */
export function v1RoleIdStatusPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleIdStatusPatchParams
  body: API.UpdateStatusDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateStatusDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/role/${param0}/status`, {
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

/** 查看单个角色树结构 GET /v1/role/tree/${param0} */
export function v1RoleTreeIdGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1RoleTreeIdGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1RoleTreeIdGetParams,
    API.ResVO & {
      data?: API.RoleTreeVO
    }
  >(`/v1/role/tree/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 查看多个角色树结构 POST /v1/role/trees */
export function v1RoleTreesPost({
  body,
  options,
}: {
  body: API.GetTreesDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetTreesDTO,
    API.ResVO & {
      data?: API.RoleTreeVO[]
    }
  >('/v1/role/trees', {
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
