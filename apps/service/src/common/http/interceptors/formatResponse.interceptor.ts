import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { Observable } from 'rxjs'
import type { IResponseFormat } from '../response'
import { Injectable } from '@nestjs/common'
import { map } from 'rxjs'
import { ResponseFormat } from '../response'
/** 成功响应格式化拦截器 */
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<IResponseFormat<T>> {
    const response = context.switchToHttp().getResponse<Response>()
    const request = context.switchToHttp().getRequest<Request>()
    return next.handle().pipe(
      map(
        (data): IResponseFormat<T> =>
          new ResponseFormat<'OK'>({
            okData: data,
            type: 'OK',
            request,
            response,
          }),
      ),
    )
  }
}
