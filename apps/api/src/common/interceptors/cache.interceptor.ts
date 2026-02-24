import type { Cache } from '@nestjs/cache-manager'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { ILoggingCls } from '@/common/infra/logging'
import { CACHE_MANAGER, CacheInterceptor as NestCacheInterceptor } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClsService } from 'nestjs-cls'
import { LogContextClass, SKIP_CACHE_KEY } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'

@Injectable()
@LogContextClass()
export class CacheInterceptor extends NestCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cache: Cache,
    reflector: Reflector,
    private readonly clsService: ClsService<ILoggingCls>,
    private readonly loggingService: LoggingService,
  ) {
    super(cache, reflector)
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const key = super.trackBy(context)
    if (key) this.loggingService.debug(`缓存键: ${key}`)
    return key
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    // 看有没有跳过缓存装饰器
    const isSkipCache = this.reflector.getAllAndOverride<boolean>(SKIP_CACHE_KEY, [context.getHandler(), context.getClass()])
    if (isSkipCache) return false
    const isCacheable = super.isRequestCacheable(context)
    if (isCacheable) this.loggingService.debug('请求可缓存')
    return isCacheable
  }

  intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    this.loggingService.debug('缓存拦截器')
    return super.intercept(context, next)
  }
}
