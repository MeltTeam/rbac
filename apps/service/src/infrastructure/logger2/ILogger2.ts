import type { LoggerService } from '@nestjs/common'
import type { Response } from 'express'
/** 日志信息 */
export interface ILoggerInfo {
  /** 请求唯一ID */
  requestId: string
  /** 客户端IP */
  clientIp: string
  /** 请求方法 */
  method: string
  /** 开始时间戳 */
  startTimestamp: number
  /** 结束时间戳 */
  endTimestamp: number
  /** 请求url */
  originUrl: string
  /** 来源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 状态码 */
  status: number
  /** 执行时间 */
  executionTime: string
}

export type LoggerType = '正常请求' | '业务异常' | '内置HTTP异常' | '手动系统异常' | '非手动系统异常' | '未知异常'

export interface ILogger2JobData {
  loggerInfo: ILoggerInfo
  exception: unknown
}

export interface IWinstonLogger extends LoggerService {
  /** 获取当前时间 */
  getTime: () => string
}

export interface ILoggerService extends LoggerService {
  /**
   * 获取日志信息
   * @param response http响应对象
   */
  getLoggerInfo: (response: Response) => ILoggerInfo

  /**
   * 记录日志动作
   * @param response http响应对象
   * @param exception 异常对象
   */
  action: (response: Response, exception?: any) => Promise<boolean>

  /**
   * 获取日志类型
   * @param exception 异常对象
   */
  getLoggerType: (exception?: unknown) => LoggerType
}
