import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { ResFormat } from '@/common/response'

/** 重写节流异常响应过滤器 */
@Catch(ThrottlerException)
export class Throttler2ExceptionFilter implements ExceptionFilter {
  async catch(exception: ThrottlerException, host: ArgumentsHost) {
    const data = '请求过于频繁，请稍后再试!!!'
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const VO = new ResFormat({ request, response, data, exception })
    response.status(status).json(VO)
  }
}
