import { Injectable } from '@nestjs/common'
import { getClientIp, uuid_v4 } from '@utils/index'
import dayjs from 'dayjs'
import { Request, Response } from 'express'
import { ClsMiddleware, ClsService } from 'nestjs-cls'

/** 日志中间件 */
@Injectable()
export class LoggerMiddleware extends ClsMiddleware {
  constructor() {
    super({
      generateId: true,
      idGenerator: (request) => ((request as Request).headers['X-Request-Id'] as string) ?? uuid_v4(),
      setup(cls: ClsService, request: Request, response: Response) {
        console.warn('LoggerMiddleware')
        const requestId = cls.getId()
        const now = dayjs().valueOf()
        // 请求信息注入请求上下文
        cls.set('CLIENT_IP', getClientIp(request))
        cls.set('METHOD', request.method)
        cls.set('START_TIMESTAMP', now)
        cls.set('ORIGIN_URL', request.originalUrl)
        cls.set('REFERER', request.headers.referer || '直接访问')
        cls.set('USER_AGENT', request.headers['user-agent'] || '未知设备')
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
