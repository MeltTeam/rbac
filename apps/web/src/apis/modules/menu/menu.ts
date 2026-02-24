import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取菜单列表 GET /v1/menu */
export function v1MenuGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuGetParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.V1MenuGetParams,
    API.ResVO & {
      data?: API.FindAllMenuVO
    }
  >('/v1/menu', {
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

/** 创建菜单 POST /v1/menu */
export function v1MenuPost({
  body,
  options,
}: {
  body: API.CreateMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.CreateMenuDTO,
    API.ResVO & {
      data?: API.MenuDetailsVO
    }
  >('/v1/menu', {
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

/** 查看单个菜单详情 GET /v1/menu/${param0} */
export function v1MenuIdGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuIdGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1MenuIdGetParams,
    API.ResVO & {
      data?: API.MenuDetailsVO
    }
  >(`/v1/menu/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 删除菜单 DELETE /v1/menu/${param0} */
export function v1MenuIdDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuIdDeleteParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1MenuIdDeleteParams,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/menu/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新菜单 PATCH /v1/menu/${param0} */
export function v1MenuIdPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuIdPatchParams
  body: API.UpdateMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateMenuDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/menu/${param0}`, {
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

/** 移动菜单 PATCH /v1/menu/${param0}/move */
export function v1MenuIdMovePatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuIdMovePatchParams
  body: API.MoveMenuDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.MoveMenuDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/menu/${param0}/move`, {
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

/** 更新菜单排序优先级 PATCH /v1/menu/${param0}/sort */
export function v1MenuIdSortPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuIdSortPatchParams
  body: API.UpdateSortDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateSortDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/menu/${param0}/sort`, {
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

/** 更新菜单状态 PATCH /v1/menu/${param0}/status */
export function v1MenuIdStatusPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuIdStatusPatchParams
  body: API.UpdateStatusDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateStatusDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/menu/${param0}/status`, {
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

/** 查看单个菜单树结构 GET /v1/menu/tree/${param0} */
export function v1MenuTreeIdGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1MenuTreeIdGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1MenuTreeIdGetParams,
    API.ResVO & {
      data?: API.MenuTreeVO
    }
  >(`/v1/menu/tree/${param0}`, {
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

/** 查看多个菜单树结构 POST /v1/menu/trees */
export function v1MenuTreesPost({
  body,
  options,
}: {
  body: API.GetTreesDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetTreesDTO,
    API.ResVO & {
      data?: API.MenuTreeVO[]
    }
  >('/v1/menu/trees', {
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
