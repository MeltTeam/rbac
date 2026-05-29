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

/** 此处后端没有提供注释 GET /v1/test */
export function v1TestGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<any, Record<string, unknown>>('/v1/test', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
