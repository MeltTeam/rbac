import type { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios'
/** 请求ID生成规则类型 */
export type TRequestIdRules = 'uuid' | 'default' | 'method:url:params' | 'method:url:data' | 'method:url'
/** HttpUtils配置接口 */
export interface IHttpConfig extends AxiosRequestConfig {
  /** 是否带token */
  withToken?: boolean
  /** 请求ID生成规则 */
  requestIdRules?: TRequestIdRules
}
/** 自定义响应接口 */
export interface IHttpResponse<T = any> extends AxiosResponse {
  /** 状态码 */
  code: number
  /** 响应信息 */
  msg: string
  /** 响应数据 */
  data: T
  /** 请求地址 */
  originUrl?: string | undefined
}
/** 自定义请求接口 */
export interface IRequestConfig extends InternalAxiosRequestConfig {
  /** 是否带token */
  withToken?: boolean
  /** 请求ID生成规则 */
  requestIdRules?: TRequestIdRules
  /** 请求ID */
  requestId?: string
}
export interface IHttpUtils {
  /** 取消队列 */
  cancelTokenQueue: Map<string, CancelTokenSource>
  /** 基础配置 */
  baseConfig: IHttpConfig
  /** 处理全局请求对象 */
  handlerRequest: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig<any>>
  /** 处理全局请求错误 */
  handlerRequestError: (error: AxiosError) => Promise<never>
  /** 处理全局响应对象 */
  handlerResponse: (response: AxiosResponse) => Promise<AxiosResponse<any, any>>
  /** 处理全局响应错误 */
  handlerResponseError: (error: AxiosError) => Promise<never>
  /**
   * 生成请求ID
   * @param config 用于生成请求ID的配置
   * @param rule 生成规则
   */
  generateRequestId: (config: IHttpConfig, rule: TRequestIdRules) => Promise<string>
  /**
   * 通用请求
   * @param config 配置
   * @returns
   */
  request: (config: IHttpConfig) => Promise<AxiosResponse<any, any>>
  /**
   * get请求
   * @param url 请求地址
   * @param params  参数
   * @param config  配置
   * @returns
   */
  get: <T = any, Dto = any>(url: string, params?: Dto, config?: IHttpConfig) => Promise<IHttpResponse<T>>
  /**
   * post请求
   * @param url 请求地址
   * @param data  参数
   * @param config  配置
   * @returns
   */
  post: <T = any, Dto = any>(url: string, data?: Dto, config?: IHttpConfig) => Promise<IHttpResponse<T>>
  /**
   * delete请求
   * @param url 请求地址
   * @param data  参数
   * @param config  配置
   * @returns
   */
  delete: <T = any, Dto = any>(url: string, data?: Dto, config?: IHttpConfig) => Promise<IHttpResponse<T>>
  /**
   * patch请求
   * @param url 请求地址
   * @param data  参数
   * @param config  配置
   * @returns
   */
  patch: <T = any, Dto = any>(url: string, data?: Dto, config?: IHttpConfig) => Promise<IHttpResponse<T>>
}
