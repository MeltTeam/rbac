import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取角色列表 getRoles GET /v1/role */
export function getRoles({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetRolesParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetRolesParams,
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

/** 创建角色 createRole POST /v1/role */
export function createRole({
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

/** 查看单个角色详情 getRoleById GET /v1/role/${param0} */
export function getRoleById({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetRoleByIdParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetRoleByIdParams,
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

/** 删除角色 deleteRole DELETE /v1/role/${param0} */
export function deleteRole({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.DeleteRoleParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.DeleteRoleParams,
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

/** 更新角色 updateRole PATCH /v1/role/${param0} */
export function updateRole({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateRoleParams
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

/** 移动角色 moveRole PATCH /v1/role/${param0}/move */
export function moveRole({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.MoveRoleParams
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

/** 更新角色排序优先级 updateRoleSort PATCH /v1/role/${param0}/sort */
export function updateRoleSort({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateRoleSortParams
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

/** 更新角色状态 updateRoleStatus PATCH /v1/role/${param0}/status */
export function updateRoleStatus({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateRoleStatusParams
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

/** 查看单个角色树结构 getRoleTree GET /v1/role/tree/${param0} */
export function getRoleTree({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetRoleTreeParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetRoleTreeParams,
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

/** 查看多个角色树结构 getRoleTrees POST /v1/role/trees */
export function getRoleTrees({
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
