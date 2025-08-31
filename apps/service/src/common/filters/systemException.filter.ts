import type { Request, Response } from 'express'
import { SYSTEM_EXCEPTION_MSG } from '@constants/index'
import { ArgumentsHost, Catch, ExceptionFilter, Inject, InternalServerErrorException } from '@nestjs/common'
import { HttpStatus } from '@packages/types'
import { ResFormat } from '@response/ResFormat'
import { WINSTON_SERVICE_TOKEN } from '@winston/winston.constant'
import { WinstonService } from '@winston/winston.service'
import { ClsService } from 'nestjs-cls'

/** 系统异常过滤器 */
@Catch()
export class systemExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_SERVICE_TOKEN)
  winstonService: WinstonService

  @Inject()
  clsService: ClsService

  catch(exception: any, host: ArgumentsHost) {
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
    const loggerInfo = this.winstonService.getLoggerInfo(this.clsService, status)
    this.winstonService.action(loggerInfo, exception)
    response.status(status).json(VO)
  }
}
