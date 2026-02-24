import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取资源列表 GET /v1/resource */
export function v1ResourceGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1ResourceGetParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.V1ResourceGetParams,
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

/** 创建资源 POST /v1/resource */
export function v1ResourcePost({
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

/** 查看单个资源详情 GET /v1/resource/${param0} */
export function v1ResourceIdGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1ResourceIdGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1ResourceIdGetParams,
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

/** 删除资源 DELETE /v1/resource/${param0} */
export function v1ResourceIdDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1ResourceIdDeleteParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1ResourceIdDeleteParams,
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

/** 更新资源 PATCH /v1/resource/${param0} */
export function v1ResourceIdPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1ResourceIdPatchParams
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

/** 更新资源排序优先级 PATCH /v1/resource/${param0}/sort */
export function v1ResourceIdSortPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1ResourceIdSortPatchParams
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

/** 更新资源状态 PATCH /v1/resource/${param0}/status */
export function v1ResourceIdStatusPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1ResourceIdStatusPatchParams
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
