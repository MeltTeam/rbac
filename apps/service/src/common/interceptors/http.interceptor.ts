import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IOKResponse } from '@packages/types'
import type { Request, Response } from 'express'
import type { Observable } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { ResFormat } from '@response/ResFormat'
import { WINSTON_SERVICE_TOKEN } from '@winston/winston.constant'
import { WinstonService } from '@winston/winston.service'
import { ClsService } from 'nestjs-cls'
import { map } from 'rxjs'

/** http拦截器 */
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  @Inject(WINSTON_SERVICE_TOKEN)
  winstonService: WinstonService

  @Inject()
  clsService: ClsService

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<IOKResponse<T>> {
    console.warn('HttpInterceptor1')
    const response = context.switchToHttp().getResponse<Response>()
    const request = context.switchToHttp().getRequest<Request>()
    return next.handle().pipe(
      map((data): IOKResponse<T> => {
        console.warn('HttpInterceptor2')
        const formatData = new ResFormat<T>({
          data,
          request,
          response,
        })
        const status = response.statusCode
        const loggerInfo = this.winstonService.getLoggerInfo(this.clsService, status)
        this.winstonService.action(loggerInfo)
        return formatData
      }),
    )
  }
}
