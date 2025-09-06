import type { Request, Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { ResFormat } from '@/common/response'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'

/** http异常过滤器 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger2Service: Logger2Service) {}

  async catch(exception: any, host: ArgumentsHost) {
    console.warn('HttpExceptionFilter')
    // http上下文
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const data = exception.getResponse()
    const VO = new ResFormat({
      request,
      response,
      data,
      exception,
    })
    await this.logger2Service.action(response, exception)
    response.status(status).json(VO)
  }
}
