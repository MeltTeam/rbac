import type { Request, Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common'
import { ResFormat } from '@response/ResFormat'
import { WINSTON_SERVICE_TOKEN } from '@winston/winston.constant'
import { WinstonService } from '@winston/winston.service'
import { ClsService } from 'nestjs-cls'

/** http异常过滤器 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_SERVICE_TOKEN)
  winstonService: WinstonService

  @Inject()
  clsService: ClsService

  catch(exception: any, host: ArgumentsHost) {
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
    const loggerInfo = this.winstonService.getLoggerInfo(this.clsService, status)
    this.winstonService.action(loggerInfo, exception)
    response.status(status).json(VO)
  }
}
