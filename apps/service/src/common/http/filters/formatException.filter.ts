import type { IErrorResponseFormat } from '../response'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import { ResponseFormat } from '../response'

/** 全局异常处理 */
@Catch(HttpException)
export class FormatExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    const request = host.switchToHttp().getRequest<Request>()
    response.statusCode = exception.getStatus()
    const error = exception.getResponse() as { message: string[] }

    const res: IErrorResponseFormat = new ResponseFormat<'ERROR'>({
      type: 'ERROR',
      request,
      response,
      error,
      exception,
    })
    response.json(res).end()
  }
}
