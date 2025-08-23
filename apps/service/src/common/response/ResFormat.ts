import type { HttpException } from '@nestjs/common'
import type { IOKResponse } from '@packages/types'
import { getClientIp } from '@utils/index'
import dayjs from 'dayjs'
import { Request, Response } from 'express'

/** 响应格式化配置接口 */
export interface IResFormatOptions<T = any> {
  /** 响应对象 */
  response: Response
  /** 请求对象 */
  request: Request
  /** 数据 */
  data: T
  /** 自定义业务状态码 */
  code?: number
  /** 自定义业务信息 */
  msg?: string
  /** 错误类 */
  exception?: HttpException
}
/** 响应格式化 */
export class ResFormat<Data = any> implements IOKResponse<Data> {
  code: number
  msg: string
  data: Data
  originUrl: string
  referer: string
  userAgent: string
  timestamp: number
  ip: string
  constructor(options: IResFormatOptions<Data>) {
    const { response, request, data, code, msg, exception } = options
    const { statusCode } = response
    this.code = code ?? (exception ? exception.getStatus() : statusCode)
    this.msg = msg ?? (exception ? 'error' : 'success')
    if (exception) {
      const message = (data as { message: Array<string> }).message
      message ? (this.data = (Array.isArray(message) ? message[0] : message) as Data) : (this.data = data)
    } else {
      this.data = data
    }

    this.originUrl = request.originalUrl
    this.referer = request?.headers?.referer ?? '直接访问'
    this.userAgent = request?.headers?.['user-agent'] ?? '未知设备'
    this.timestamp = dayjs().unix()
    this.ip = getClientIp(request)
  }
}
