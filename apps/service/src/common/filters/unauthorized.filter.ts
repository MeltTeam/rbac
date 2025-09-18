import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'
import { ResFormat } from '@/common/response'

/** 重写未授权异常响应过滤器 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  async catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const data = '令牌已失效，请重新登录'
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const VO = new ResFormat({ request, response, data, exception })
    response.status(status).json(VO)
  }
}
