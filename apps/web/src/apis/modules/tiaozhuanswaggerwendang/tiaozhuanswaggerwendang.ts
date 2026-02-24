import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'
import { http } from '@/utils/http'

/** 跳转swagger文档 GET /v1 */
export function v1Get({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/dd-obj */
export function v1DdobjGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/dd-obj', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/del-obj */
export function v1DelobjGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/del-obj', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/del-str */
export function v1DelstrGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/del-str', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/get-obj */
export function v1GetobjGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, Record<string, unknown>>('/v1/get-obj', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/get-str */
export function v1GetstrGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, Record<string, unknown>>('/v1/get-str', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/put-obj */
export function v1PutobjGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/put-obj', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/set-arr */
export function v1SetarrGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/set-arr', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/set-obj */
export function v1SetobjGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/set-obj', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/set-str */
export function v1SetstrGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/set-str', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/test */
export function v1TestGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/test', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 此处后端没有提供注释 GET /v1/update-str */
export function v1UpdatestrGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, unknown>('/v1/update-str', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
