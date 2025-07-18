import type { AxiosError, AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios'
import type { IHttpConfig, IHttpResponse, IHttpUtils, IRequestConfig } from './interfaces/IHttpUtils'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { v4 as uuidV4 } from 'uuid'
import 'element-plus/theme-chalk/el-notification.css'

export class HttpUtils implements IHttpUtils {
  /** HttpUtils实例 */
  private static instance: HttpUtils | null = null
  /** axios实例 */
  private axiosInstance: AxiosInstance
  private CancelToken = axios.CancelToken
  cancelTokenQueue = new Map<string, CancelTokenSource>()

  baseConfig: IHttpConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4001/dev',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  private constructor(config?: IHttpConfig) {
    this.axiosInstance = axios.create({
      ...this.baseConfig,
      ...config,
    })
    /** 全局请求拦截器 */
    this.axiosInstance.interceptors.request.use(
      (config) => this.handlerRequest(config),
      (error) => this.handlerRequestError(error),
    )
    /** 全局响应拦截器 */
    this.axiosInstance.interceptors.response.use(
      (response) => this.handlerResponse(response),
      (error) => this.handlerResponseError(error),
    )
  }

  async handlerRequest(config: IRequestConfig) {
    const requestId = await this.generateRequestId(config)
    const CancelTokenSource = this.CancelToken.source()
    config.cancelToken = CancelTokenSource.token
    config.requestId = requestId
    /** 找 */
    const cancelTokenQueueItem = this.cancelTokenQueue.get(requestId)

    if (cancelTokenQueueItem) {
      cancelTokenQueueItem.cancel(`取消重复请求:${requestId}`)
    }
    this.cancelTokenQueue.set(requestId, CancelTokenSource)
    console.warn(this.cancelTokenQueue)
    return config
  }

  async handlerRequestError(error: AxiosError) {
    return Promise.reject(error)
  }

  async handlerResponse(response: AxiosResponse) {
    const requestId = (response.config as IRequestConfig).requestId
    if (requestId) this.cancelTokenQueue.delete(requestId)
    ElNotification({
      type: 'info',
      title: '提示',
      message: h('p', null, JSON.stringify(response.data.data.svg[0])),
    })
    return response
  }

  async handlerResponseError(error: AxiosError) {
    /** 取消请求的错误 */
    if (axios.isCancel(error)) return Promise.reject(error)
    return Promise.reject(error)
  }

  async generateRequestId(config: IHttpConfig) {
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
  public static create(config?: IHttpConfig) {
    if (!this.instance) this.instance = new HttpUtils(config)
    return this.instance
  }

  public async request<T = any, R = IHttpResponse<T>>(config: IHttpConfig): Promise<R> {
    try {
      const response = await this.axiosInstance.request<R>(config)
      return response.data
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async get<T = any, Dto = any>(url: string, params?: Dto, config?: IHttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'get',
      params,
      ...config,
    })
    return response
  }

  public async post<T = any, Dto = any>(url: string, data?: Dto, config?: IHttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'post',
      data,
      ...config,
    })
    return response
  }

  public async delete<T = any, Dto = any>(url: string, data?: Dto, config?: IHttpConfig) {
    const response = await this.request<T>({
      url,
      method: 'delete',
      data,
      ...config,
    })
    return response
  }

  public async patch<T = any, Dto = any>(url: string, data?: Dto, config?: IHttpConfig) {
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
