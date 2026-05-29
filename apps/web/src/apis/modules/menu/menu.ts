import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取菜单列表 getMenus GET /v1/menu */
export function getMenus({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetMenusParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetMenusParams,
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

/** 创建菜单 createMenu POST /v1/menu */
export function createMenu({
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

/** 查看单个菜单详情 getMenuById GET /v1/menu/${param0} */
export function getMenuById({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetMenuByIdParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetMenuByIdParams,
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

/** 删除菜单 deleteMenu DELETE /v1/menu/${param0} */
export function deleteMenu({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.DeleteMenuParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.DeleteMenuParams,
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

/** 更新菜单 updateMenu PATCH /v1/menu/${param0} */
export function updateMenu({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateMenuParams
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

/** 移动菜单 moveMenu PATCH /v1/menu/${param0}/move */
export function moveMenu({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.MoveMenuParams
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

/** 更新菜单排序优先级 updateMenuSort PATCH /v1/menu/${param0}/sort */
export function updateMenuSort({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateMenuSortParams
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

/** 更新菜单状态 updateMenuStatus PATCH /v1/menu/${param0}/status */
export function updateMenuStatus({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateMenuStatusParams
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

/** 查看单个菜单树结构 getMenuTree GET /v1/menu/tree/${param0} */
export function getMenuTree({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetMenuTreeParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetMenuTreeParams,
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

/** 查看多个菜单树结构 getMenuTrees POST /v1/menu/trees */
export function getMenuTrees({
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
