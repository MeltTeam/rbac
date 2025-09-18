import type { Request, Response } from 'express'
import type { ILoggerCls } from './ILogger2'
import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { ClsMiddleware, ClsService } from 'nestjs-cls'
import { getClientIp, uuid_v4 } from '@/common/utils'
import { LOGGER_CLS } from './logger2.constant'

/** 日志中间件 */
@Injectable()
export class Logger2Middleware extends ClsMiddleware {
  constructor() {
    super({
      generateId: true,
      idGenerator: (request) => ((request as Request).headers['X-Request-Id'] as string) ?? uuid_v4(),
      setup(cls: ClsService<ILoggerCls>, request: Request, response: Response) {
        console.warn('LoggerMiddleware')
        const requestId = cls.getId()
        const now = dayjs().valueOf()
        // 请求信息注入请求上下文
        cls.set(LOGGER_CLS.CLIENT_IP, getClientIp(request))
        cls.set(LOGGER_CLS.METHOD, request.method)
        cls.set(LOGGER_CLS.START_TIMESTAMP, now)
        cls.set(LOGGER_CLS.ORIGIN_URL, request.originalUrl)
        cls.set(LOGGER_CLS.REFERER, request.headers.referer || '直接访问')
        cls.set(LOGGER_CLS.USER_AGENT, request.headers['user-agent'] || '未知设备')
        const headers = new Map([
          /** 请求唯一ID */
          ['X-Request-Id', requestId],
          /** 系统引擎 */
          ['X-Powered-By', 'rbac'],
          ['X-Start-Timestamp', String(now)],
        ])
        response.setHeaders(headers)
      },
    })
  }
}
