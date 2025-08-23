import type { ILoggerInfo } from '@middlewares/logger.middleware'
import { SYSTEM_EXCEPTION_MSG } from '@constants/index'
import { BusinessException } from '@exceptions/business.exception'
import { SystemException } from '@exceptions/index'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, InternalServerErrorException, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { HttpStatus } from '@packages/types'
import { ResFormat } from '@response/ResFormat'
import dayjs from 'dayjs'
import { Request, Response } from 'express'
import { ClsService } from 'nestjs-cls'
/** 异常响应格式化过滤器 */
@Catch()
export class FormatResFilter extends BaseExceptionFilter implements ExceptionFilter {
  @Inject(ClsService)
  private readonly clsService: ClsService

  loggerInfo: ILoggerInfo = {
    requestId: '',
    clientIp: '',
    method: '',
    startTimestamp: '',
    endTimestamp: '',
    originUrl: '',
    referer: '',
    userAgent: '',
    type: '未知异常',
    status: 0,
  }

  logger: Logger
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger = new Logger(FormatResFilter.name)
    console.warn('FormatResFilter')
    // http上下文
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    // 请求信息
    this.loggerInfo.requestId = this.clsService.get('REQUEST_ID')
    this.loggerInfo.clientIp = this.clsService.get('CLIENT_IP')
    this.loggerInfo.method = this.clsService.get('METHOD')
    this.loggerInfo.startTimestamp = this.clsService.get('START_TIMESTAMP')
    this.loggerInfo.originUrl = this.clsService.get('ORIGIN_URL')
    this.loggerInfo.referer = this.clsService.get('REFERER')
    this.loggerInfo.userAgent = this.clsService.get('USER_AGENT')
    this.loggerInfo.endTimestamp = dayjs().toISOString()

    try {
      // http类型异常
      if (exception instanceof HttpException) {
        this.handleHttpException(exception, request, response)
      } else {
        this.handleSystemException(exception, request, response)
      }
    } catch (error: unknown) {
      this.handleUnknownException(error, request, response)
    }
    super.catch(exception, host)
  }

  /**
   * 处理http异常
   * @param exception http异常对象
   * @param request 请求对象
   * @param response 响应对象
   */
  handleHttpException(exception: HttpException, request: Request, response: Response) {
    if (exception instanceof BusinessException) {
      this.handleBusinessException(exception, request, response)
    } else {
      const status = exception.getStatus()
      const data = exception.getResponse()
      const VO = new ResFormat({
        request,
        response,
        data,
        exception,
      })
      console.warn(exception)
      this.error('内置http异常', status)
      response.status(status).json(VO)
    }
  }

  /**
   * 处理业务异常
   * @param exception 业务异常对象
   * @param request 请求对象
   * @param response 响应对象
   */
  handleBusinessException(exception: BusinessException, request: Request, response: Response) {
    const msg = '业务异常'
    const status = exception.getStatus()
    const data = exception.getResponse()
    const VO = new ResFormat({
      request,
      response,
      data,
      exception,
    })
    console.warn(msg)
    this.error('业务异常', status)
    response.status(status).json(VO)
  }

  /**
   * 处理系统异常
   * @param error 系统异常对象
   * @param request 请求对象
   * @param response 响应对象
   */
  handleSystemException(error: unknown, request: Request, response: Response) {
    if (error instanceof SystemException) {
      console.warn('手动')
    }
    const status = HttpStatus.INTERNAL_SERVER_ERROR
    const data = SYSTEM_EXCEPTION_MSG
    const VO = new ResFormat({
      request,
      response,
      data,
      exception: new InternalServerErrorException(SYSTEM_EXCEPTION_MSG),
    })
    this.error('基建模块异常', status)
    response.status(status).json(VO)
  }

  /**
   * 处理未知异常
   * @param error 错误对象
   * @param request 请求对象
   * @param response 响应对象
   */
  handleUnknownException(error: unknown, request: Request, response: Response) {
    const status = HttpStatus.INTERNAL_SERVER_ERROR
    const data = SYSTEM_EXCEPTION_MSG
    const VO = new ResFormat({
      request,
      response,
      data,
      exception: new InternalServerErrorException(SYSTEM_EXCEPTION_MSG),
    })
    console.warn((error as Error).message)
    this.error('未知异常', status)
    response.status(status).json(VO)
  }

  error(type: ILoggerInfo['type'], status: ILoggerInfo['status']) {
    this.loggerInfo.type = type
    this.loggerInfo.status = status
    const {
      /** 请求唯一ID */
      requestId,
      /** 客户端IP */
      clientIp,
      /** 请求方法 */
      method,
      /** 开始时间戳 */
      startTimestamp,
      /** 结束时间戳 */
      endTimestamp,
      /** 请求url */
      originUrl,
      /** 来源 */
      referer,
      /** 客户端信息 */
      userAgent,
    } = this.loggerInfo
    this.logger.error(
      `异常类型:${type} http状态码:${status} 请求ID:${requestId} 客户端IP:${clientIp} 请求方法:${method} 开始时间:${startTimestamp} 结束时间:${endTimestamp} 请求URL:${originUrl} 来源:${referer} 客户端信息:${userAgent}`,
    )
  }
}
