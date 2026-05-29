import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取资源列表 getResources GET /v1/resource */
export function getResources({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetResourcesParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetResourcesParams,
    API.ResVO & {
      data?: API.FindAllResourceVO
    }
  >('/v1/resource', {
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

/** 创建资源 createResource POST /v1/resource */
export function createResource({
  body,
  options,
}: {
  body: API.CreateResourceDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.CreateResourceDTO,
    API.ResVO & {
      data?: API.ResourceDetailsVO
    }
  >('/v1/resource', {
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

/** 查看单个资源详情 getResourceById GET /v1/resource/${param0} */
export function getResourceById({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetResourceByIdParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetResourceByIdParams,
    API.ResVO & {
      data?: API.ResourceDetailsVO
    }
  >(`/v1/resource/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 删除资源 deleteResource DELETE /v1/resource/${param0} */
export function deleteResource({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.DeleteResourceParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.DeleteResourceParams,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/resource/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新资源 updateResource PATCH /v1/resource/${param0} */
export function updateResource({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateResourceParams
  body: API.UpdateResourceDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateResourceDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/resource/${param0}`, {
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

/** 更新资源排序优先级 updateResourceSort PATCH /v1/resource/${param0}/sort */
export function updateResourceSort({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateResourceSortParams
  body: API.UpdateSortDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateSortDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/resource/${param0}/sort`, {
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

/** 更新资源状态 updateResourceStatus PATCH /v1/resource/${param0}/status */
export function updateResourceStatus({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateResourceStatusParams
  body: API.UpdateStatusDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateStatusDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/resource/${param0}/status`, {
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
