/** 成功响应 */
export interface IOKResponse<T = any> {
  /** 业务码 */
  code: number | string
  /** 信息 */
  msg: string
  /** 数据 */
  data: T
  /** 请求地址 */
  originUrl: string
  /** 请求源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 时间戳 */
  timestamp: number
}
/** 失败响应 */
export interface IErrorResponse extends IOKResponse<string> {}
