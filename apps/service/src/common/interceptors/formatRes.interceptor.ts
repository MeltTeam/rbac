import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IOKResponse } from '@packages/types'
import type { Request, Response } from 'express'
import type { Observable } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { ResFormat } from '@response/ResFormat'
import { map } from 'rxjs'
/** 成功响应格式化拦截器 */
@Injectable()
export class FormatResInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<IOKResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>()
    const request = context.switchToHttp().getRequest<Request>()
    return next.handle().pipe(
      map(
        (data): IOKResponse<T> =>
          new ResFormat({
            data,
            request,
            response,
          }),
      ),
    )
  }
}
