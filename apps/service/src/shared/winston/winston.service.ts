import type { LoggerService } from '@nestjs/common'
import type { ClsService } from 'nestjs-cls'
import type { Logger, LoggerOptions } from 'winston'
import { BusinessException, SystemException } from '@exceptions/index'
import { HttpException } from '@nestjs/common'
import dayjs from 'dayjs'
import { createLogger } from 'winston'
import { WINSTON_DEFAULT_CONFIG } from './winston.constant'
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
/** 日志服务 */
export class WinstonService implements LoggerService {
  private readonly logger: Logger

  constructor(options?: LoggerOptions) {
    this.logger = createLogger(options || WINSTON_DEFAULT_CONFIG)
  }

  getTime() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }

  getLoggerInfo(clsService: ClsService, status: number): ILoggerInfo {
    const requestId = clsService.getId()
    const clientIp = clsService.get('CLIENT_IP')
    const method = clsService.get('METHOD')
    const startTimestamp = clsService.get('START_TIMESTAMP')
    const endTimestamp = dayjs().valueOf()
    const originUrl = clsService.get('ORIGIN_URL')
    const referer = clsService.get('REFERER')
    const userAgent = clsService.get('USER_AGENT')
    const executionTime = `${dayjs(endTimestamp).diff(dayjs(startTimestamp), 'millisecond', true)}ms`
    return {
      requestId,
      clientIp,
      method,
      startTimestamp,
      endTimestamp,
      originUrl,
      referer,
      userAgent,
      status,
      executionTime,
    }
  }

  /**
   * 记录日志动作
   * @param loggerInfo 日志信息
   * @param exception 异常对象
   */
  action(loggerInfo: ILoggerInfo, exception?: any) {
    const { originUrl } = loggerInfo
    const context = `${originUrl}` || 'Unknown'
    switch (true) {
      case !exception: {
        this.log(JSON.stringify(loggerInfo), context)
        break
      }
      case exception instanceof BusinessException: {
        this.warn('业务异常', context)
        break
      }

      case exception instanceof HttpException: {
        const res = exception.getResponse() as any
        this.warn(
          JSON.stringify({
            ...loggerInfo,
            warnMessage: Array.isArray(res.message) ? res.message[0] : res.message,
          }),
          context,
        )
        break
      }
      case exception instanceof SystemException: {
        this.error(
          JSON.stringify({
            ...loggerInfo,
            type: '手动系统异常',
            msg: exception.message,
            stack: exception.stack,
          }),
          context,
        )
        break
      }
      case exception instanceof Error: {
        this.error(
          JSON.stringify({
            ...loggerInfo,
            type: '非手动系统异常',
            msg: exception.message,
            stack: exception.stack,
          }),
          context,
        )
        break
      }

      default: {
        this.error(
          JSON.stringify({
            ...loggerInfo,
            type: '未知异常',
            msg: exception.message,
            stack: exception.stack,
          }),
          context,
        )
      }
    }
  }

  log(message: string, context: string) {
    this.logger.info(message, { isLog: true, context, time: this.getTime() })
  }

  error(message: string, context: string) {
    this.logger.error(message, { context, time: this.getTime() })
  }

  warn(message: string, context: string) {
    this.logger.warn(message, { context, time: this.getTime() })
  }

  info(message: string, context: string) {
    this.logger.info(message, { context, time: this.getTime() })
  }

  http(message: string, context: string) {
    this.logger.http(message, { context, time: this.getTime() })
  }

  verbose(message: string, context: string) {
    this.logger.verbose(message, { context, time: this.getTime() })
  }

  debug(message: string, context: string) {
    this.logger.debug(message, { context, time: this.getTime() })
  }
}
