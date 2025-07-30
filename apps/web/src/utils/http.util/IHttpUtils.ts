import type { IErrorResponse, IOKResponse } from '@packages/types'
import type { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios'
/** 请求ID生成规则类型 */
export type TRequestIdRules = 'uuid' | 'default' | 'method:url:params' | 'method:url:data' | 'method:url'
/** 自定义配置 */
export interface ICustomConfig {
  /** UI层是否显示错误 */
  showError?: boolean
  /** UI层显示错误消失延迟 */
  ErrorMessageDuration?: number
  /** 是否显示请求加载条(页面顶部) */
  showLoading?: boolean
  /** 是否带token */
  withToken?: boolean
  /** 请求ID生成规则 */
  requestIdRules?: TRequestIdRules
  /** 请求ID */
  requestId?: string
  /** 允许重复(默认为false) */
  allowDuplicate?: boolean
  /** 重复请求提示 */
  duplicateMessage?: string
  /** 限制时间 */
  limitTime?: number
  /** 限制类型(默认为Throttle) */
  limitType?: 'Throttle' | 'Debounce'
  /** 限制错误提示 */
  limitMessage?: string
  /** 自定义请求错误处理 */
  customErrorHandler?: (error: TRequestError) => any
}
/** HttpUtils配置接口 */
export type THttpConfig = AxiosRequestConfig & ICustomConfig
/** 自定义请求类型 */
export type TRequest = InternalAxiosRequestConfig & ICustomConfig
/** 自定义响应类型 */
export type TResponse = AxiosResponse & {
  config: TRequest
}
/** 自定义请求错误类型 */
export type TRequestError = AxiosError<any> & {
  config: TRequest
}
/** 取消队列元素类型 */
export interface IRequestQueueItem {
  /** 用于取消请求的token */
  cancelToken: CancelTokenSource
}
/** 取消队列类型 */
export type TRequestQueue = Map<string, IRequestQueueItem>
/** 限制队列类型 */
export type TLimitQueue = Map<
  string,
  {
    timer: number
    lastTime: Date
  }
>
export interface IHttpUtils {
  /** 取消队列 */
  requestQueue: TRequestQueue
  /** 限制队列 */
  limitQueue: TLimitQueue
  /** 基础配置 */
  baseConfig: THttpConfig
  /** 全局请求拦截器 */
  requestInterceptors: (config: TRequest) => Promise<TRequest>
  /** 全局请求拦截器的错误 */
  requestInterceptorsError: (error: TRequestError) => Promise<never>
  /** 全局响应拦截器 */
  responseInterceptors: (response: TResponse) => Promise<AxiosResponse<any, any>>
  /** 全局响应拦截器的错误 */
  responseInterceptorsError: (error: TRequestError) => Promise<never>
  /** 处理限制请求的错误 */
  handleLimitError: (error: TRequestError) => Promise<never> | null
  /** 处理未知错误 */
  handleUnknownError: (error: TRequestError) => Promise<never>
  /** 处理限制请求 */
  requestLimit: (config: TRequest) => null | AxiosError<unknown, any>
  /** 处理重复请求 */
  requestDuplicate: (config: TRequest) => TRequest | null
  /** 生成请求ID */
  generateRequestId: (config: TRequest) => string
  /**
   * 通用请求
   * @param config 请求配置
   */
  request: (config: THttpConfig) => Promise<AxiosResponse<any, any>>
  /**
   * get请求
   * @param url 请求地址
   * @param params  参数
   * @param config  请求配置
   */
  get: <T = any, Dto = any>(url: string, params?: Dto, config?: THttpConfig) => Promise<IOKResponse<T> | IErrorResponse>
  /**
   * post请求
   * @param url 请求地址
   * @param data  参数
   * @param config  请求配置
   */
  post: <T = any, Dto = any>(url: string, data?: Dto, config?: THttpConfig) => Promise<IOKResponse<T> | IErrorResponse>
  /**
   * delete请求
   * @param url 请求地址
   * @param data  参数
   * @param config  请求配置
   */
  delete: <T = any, Dto = any>(url: string, data?: Dto, config?: THttpConfig) => Promise<IOKResponse<T> | IErrorResponse>
  /**
   * patch请求
   * @param url 请求地址
   * @param data  参数
   * @param config  请求配置
   */
  patch: <T = any, Dto = any>(url: string, data?: Dto, config?: THttpConfig) => Promise<IOKResponse<T> | IErrorResponse>
}
