import type { IErrorResponseFormat } from '../response'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { ResponseFormat } from '../response'

/** 自定义节流异常响应过滤器 */
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    const request = host.switchToHttp().getRequest<Request>()
    response.statusCode = exception.getStatus()
    const res: IErrorResponseFormat = new ResponseFormat<'ERROR'>({
      type: 'ERROR',
      request,
      response,
      exception,
      error: {
        message: ['请求过于频繁，请稍后再试!!!'],
      },
    })
    response.json(res).end()
  }
}
