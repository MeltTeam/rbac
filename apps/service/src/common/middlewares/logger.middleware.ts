import { Injectable } from '@nestjs/common'
import { getClientIp, uuid_v4 } from '@utils/index'
import dayjs from 'dayjs'
import { Request, Response } from 'express'
import { ClsMiddleware, ClsService } from 'nestjs-cls'

/** 日志信息 */
export interface ILoggerInfo {
  /** 请求唯一ID */
  requestId: string
  /** 客户端IP */
  clientIp: string
  /** 请求方法 */
  method: string
  /** 开始时间戳 */
  startTimestamp: string
  /** 结束时间戳 */
  endTimestamp: string
  /** 请求url */
  originUrl: string
  /** 来源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 状态码 */
  status: number
  /** 类型 */
  type: '业务异常' | '基建模块异常' | '未知异常' | '内置http异常' | '成功'
}
/** 日志中间件 */
@Injectable()
export class LoggerMiddleware extends ClsMiddleware {
  constructor() {
    super({
      setup(cls: ClsService, request: Request, response: Response) {
        console.warn('LoggerMiddleware')
        const requestId = uuid_v4()
        const now = dayjs().toISOString()
        const headers = new Map([
          /** 请求唯一ID */
          ['X-Request-Id', requestId],
          /** 系统引擎 */
          ['X-Powered-By', 'rbac'],
          ['X-Start-Timestamp', now],
        ])
        cls.set('REQUEST_ID', requestId)
        cls.set('CLIENT_IP', getClientIp(request))
        cls.set('METHOD', request.method)
        cls.set('START_TIMESTAMP', now)
        cls.set('ORIGIN_URL', request.originalUrl)
        cls.set('REFERER', request.headers.referer || '直接访问')
        cls.set('USER_AGENT', request.headers['user-agent'] || '未知设备')
        response.setHeaders(headers)
      },
    })
  }
}
