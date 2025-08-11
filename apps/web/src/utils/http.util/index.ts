import type { IErrorResponse, IOKResponse } from '@packages/types'
import type { AxiosInstance } from 'axios'
import type { IHttpUtils, THttpConfig, TLimitQueue, TRequest, TRequestError, TRequestQueue, TResponse } from './IHttpUtils'
import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { v4 as uuidV4 } from 'uuid'
import { nProgress } from '@/router/guard/progress'
import 'element-plus/theme-chalk/el-message.css'

export class HttpUtils implements IHttpUtils {
  /** HttpUtils实例 */
  private static instance: HttpUtils | null = null
  /** axios实例 */
  private axiosInstance: AxiosInstance
  private CancelToken = axios.CancelToken
  requestQueue: TRequestQueue = new Map()
  limitQueue: TLimitQueue = new Map()

  baseConfig: THttpConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4001/dev',
    timeout: 2000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    showError: true,
    ErrorMessageDuration: 1000,
    showLoading: false,
    withToken: true,
    allowDuplicate: false,
    limitType: 'Throttle',
    limitMessage: '该请求已限制，请稍后再试!!!',
  }

  private constructor(config?: THttpConfig) {
    this.axiosInstance = axios.create({
      ...this.baseConfig,
      ...config,
    })
    /** 全局请求拦截器 */
    this.axiosInstance.interceptors.request.use(
      (config) => this.requestInterceptors(config),
      (error) => this.requestInterceptorsError(error),
    )
    /** 全局响应拦截器 */
    this.axiosInstance.interceptors.response.use(
      (response) => this.responseInterceptors(response),
      (error) => this.responseInterceptorsError(error),
    )
  }

  async requestInterceptors(config: TRequest) {
    // 处理限制请求
    const limit = this.requestLimit(config)
    if (limit) return Promise.reject(limit)
    // 处理上一次重复请求
    const duplicate = this.requestDuplicate(config)
    if (duplicate) config = duplicate
    // 加载条
    if (config?.showLoading) nProgress.start()
    return config
  }

  async requestInterceptorsError(error: TRequestError) {
    return Promise.reject(error)
  }

  async responseInterceptors(response: TResponse) {
    const { showLoading, allowDuplicate, requestId } = response.config
    // 加载条
    if (showLoading) nProgress.done()
    if (requestId && !allowDuplicate) this.requestQueue.delete(requestId)
    return response
  }

  async responseInterceptorsError(error: TRequestError) {
    const { showLoading, allowDuplicate, requestId } = error.config
    // 加载条
    if (showLoading) nProgress.done()
    if (requestId && !allowDuplicate) this.requestQueue.delete(requestId)

    /** 限制请求的错误 */
    const limitError = this.handleLimitError(error)
    if (limitError) return limitError
    /** 取消请求的错误 */
    if (axios.isCancel(error)) return Promise.reject(error)

    /** 未知的错误 */
    return this.handleUnknownError(error)
  }

  handleLimitError(error: TRequestError) {
    if (error.code !== 'limit') return null
    const { showError, limitMessage, customErrorHandler, ErrorMessageDuration } = error.config
    const errorMessage = limitMessage || error.message
    if (showError) {
      ElMessage({
        message: errorMessage,
        type: 'error',
        duration: ErrorMessageDuration || 1000,
      })
    }
    if (customErrorHandler) customErrorHandler(error)
    return Promise.reject({
      code: -3,
      message: errorMessage,
      data: null,
    })
  }

  handleUnknownError(error: TRequestError) {
    const { showError, ErrorMessageDuration, customErrorHandler } = error.config
    const errorMessage: string = '未知错误'
    if (showError) {
      ElMessage({
        message: `${errorMessage}:${error.message}`,
        type: 'error',
        duration: ErrorMessageDuration || 1000,
      })
    }
    if (customErrorHandler) customErrorHandler(error)
    return Promise.reject({
      code: -2,
      message: error.message,
      data: null,
    })
  }

  requestLimit(config: TRequest) {
    const { limitTime, limitType, limitMessage } = config
    if (typeof limitTime !== 'number') return null
    const requestId = this.generateRequestId(config)
    const limitItem = this.limitQueue.get(requestId)
    const now = new Date()
    if (limitType === 'Debounce') {
      clearTimeout(limitItem?.timer || 0)
      this.limitQueue.set(requestId, {
        lastTime: now,
        timer: setTimeout(() => {
          this.limitQueue.delete(requestId)
        }, limitTime),
      })
    }
    if (limitType === 'Throttle' && (!limitItem || +now - +limitItem!.lastTime! > limitTime!)) {
      this.limitQueue.set(requestId, {
        lastTime: now,
        timer: 0,
      })
    }
    if (limitItem) {
      if (limitItem.timer !== 0 || (limitItem.timer === 0 && +now - +limitItem!.lastTime < limitTime!))
        return new AxiosError(limitMessage, 'limit', config)
    }

    return null
  }

  requestDuplicate(config: TRequest) {
    if (config.allowDuplicate) return null
    const requestId = this.generateRequestId(config)
    const CancelTokenSource = this.CancelToken.source()
    config.cancelToken = CancelTokenSource.token
    config.requestId = requestId
    const requestQueueItem = this.requestQueue.get(requestId)
    if (requestQueueItem) requestQueueItem.cancelToken.cancel(config.duplicateMessage ?? `取消上次请求:${requestId}`)
    this.requestQueue.set(requestId, {
      cancelToken: CancelTokenSource,
    })
    return config
  }

  generateRequestId(config: TRequest) {
    const rule = config.requestIdRules ?? 'default'
    if (rule === 'uuid') return uuidV4()
    const { url, method, params, data } = config
    const _JSON = (d: any) => (d ? JSON.stringify(d) : 'null')
    switch (rule) {
      case 'method:url:params':
        return `${method}:${url}?${_JSON(params)}`
      case 'method:url:data':
        return `${method}:${url}&${_JSON(data)}`
      case 'method:url':
        return `${method}:${url}`
      default:
        return `${method}:${url}?${_JSON(params)}&${_JSON(data)}`
    }
  }

  /** 创建实例 */
  public static create(config?: THttpConfig) {
    if (!this.instance) this.instance = new HttpUtils(config)
    return this.instance
  }

  public async request<T = any, R = IOKResponse<T> | IErrorResponse>(config: THttpConfig): Promise<R> {
    try {
      const response = await this.axiosInstance.request<R>(config)
      return response?.data as R
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async get<T = any, Dto = any>(url: string, params?: Dto, config?: THttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'get',
      params,
      ...config,
    })
    return response
  }

  public async post<T = any, Dto = any>(url: string, data?: Dto, config?: THttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'post',
      data,
      ...config,
    })
    return response
  }

  public async delete<T = any, Dto = any>(url: string, data?: Dto, config?: THttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'delete',
      data,
      ...config,
    })
    return response
  }

  public async patch<T = any, Dto = any>(url: string, data?: Dto, config?: THttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'patch',
      data,
      ...config,
    })
    return response
  }
}
export const request = HttpUtils.create()
