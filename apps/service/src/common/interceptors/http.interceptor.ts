import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IOKResponse } from '@packages/types'
import type { Request, Response } from 'express'
import type { Observable } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { map } from 'rxjs'
import { ResFormat } from '@/common/response'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'

/** http拦截器 */
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(private readonly logger2Service: Logger2Service) {}

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<Promise<IOKResponse<T>>> {
    // 前置拦截器
    console.warn('HttpInterceptor1')
    const response = context.switchToHttp().getResponse<Response>()
    const request = context.switchToHttp().getRequest<Request>()
    // 后置拦截器
    return next.handle().pipe(
      map(async (data): Promise<IOKResponse<T>> => {
        console.warn('HttpInterceptor2')
        const formatData = new ResFormat<T>({ data, request, response })
        await this.logger2Service.action(response)
        return formatData
      }),
    )
  }
}
