import type { Request, Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common'
import { HttpStatus } from '@packages/types'
import { SYSTEM_EXCEPTION_MSG } from '@/common/constants'
import { ResFormat } from '@/common/response'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'

/** 系统异常过滤器 */
@Catch()
export class systemExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger2Service: Logger2Service) {}

  async catch(exception: any, host: ArgumentsHost) {
    console.warn('systemExceptionFilter')
    // http上下文
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status = HttpStatus.INTERNAL_SERVER_ERROR
    const data = SYSTEM_EXCEPTION_MSG
    const VO = new ResFormat({
      request,
      response,
      data,
      exception: new InternalServerErrorException(SYSTEM_EXCEPTION_MSG),
    })
    await this.logger2Service.action(response, exception)
    response.status(status).json(VO)
  }
}
