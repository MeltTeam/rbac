import type { LoggerService } from '@nestjs/common'
import type { Response } from 'express'
import type { LOGGER_TYPES } from './logger2.constant'
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
  getLoggerType: (exception?: unknown) => (typeof LOGGER_TYPES)[keyof typeof LOGGER_TYPES]
}
