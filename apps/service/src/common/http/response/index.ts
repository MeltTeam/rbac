import type { HttpException } from '@nestjs/common'
import dayjs from 'dayjs'
import { Request, Response } from 'express'
/** 正常响应格式化 */
export interface IResponseFormat<T = any> {
  /** 业务状态码 */
  code: number
  /** 业务信息 */
  msg: string
  /** 业务数据 */
  data: T
  /** 原始url */
  originUrl: string
  /** 来源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 时间戳 */
  timestamp: number
}
/** 错误响应格式化 */
export interface IErrorResponseFormat extends IResponseFormat<string> {}

export interface IBaseOptions<TYPE extends 'OK' | 'ERROR' = 'OK'> {
  /** 自定义业务状态码 */
  code?: number
  /** 自定义业务信息 */
  msg?: string
  /** 成功业务数据 */
  okData: any
  /** 响应对象 */
  response: Response
  /** 请求对象 */
  request: Request
  /** 格式化类型 */
  type: TYPE
  /** 错误类 */
  exception: HttpException
  /** 错误 */
  error: {
    /** 错误信息 */
    message: string[]
  }
}
export type IResponseFormatOptions<T extends 'OK' | 'ERROR' = 'OK' | 'ERROR'> = T extends 'OK'
  ? Omit<IBaseOptions<T>, 'exception' | 'error'>
  : Omit<IBaseOptions<T>, 'okData'>

/** 响应格式化 */
export class ResponseFormat<T extends 'OK' | 'ERROR' = 'OK' | 'ERROR'> implements IResponseFormat {
  code: number
  msg: string
  data: any
  originUrl: string
  referer: string
  userAgent: string
  timestamp: number
  constructor(options: IResponseFormatOptions<T>) {
    const { code, response, request, msg, type } = options
    this.msg = msg ?? (type === 'OK' ? '成功' : '失败')
    this.originUrl = response?.req?.originalUrl
    this.referer = request?.headers?.referer ?? '直接访问'
    this.userAgent = request?.headers?.['user-agent'] ?? '未知设备'
    this.timestamp = dayjs().unix()
    if (type === 'OK') {
      const { okData } = options
      this.code = response.statusCode
      this.data = okData
    }
    if (type === 'ERROR') {
      const { error, exception } = options
      this.code = exception.getStatus()
      this.data = error?.message?.join ? error?.message?.join(',') : exception?.message
    }
    if (code) this.code = code
  }
}
