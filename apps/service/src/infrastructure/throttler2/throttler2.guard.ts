import type { ExecutionContext } from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'
import type Redis from 'ioredis'
import { Inject, Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { getClientIp } from '@/common/utils'
import { redisIsOk } from '@/infrastructure/redis/redis.utils'
import { THROTTLER2_REDIS_CLIENT_TOKEN } from './throttler2.constant'

/** 节流守卫 */
@Injectable()
export class Throttler2Guard extends ThrottlerGuard {
  @Inject(THROTTLER2_REDIS_CLIENT_TOKEN)
  private readonly throttler2Redis: Redis

  /** 重写获取原始IP */
  protected async getTracker(req: ExpressRequest): Promise<string> {
    return getClientIp(req)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 节流器依赖的redis断开,不走节流逻辑
    if (!redisIsOk(this.throttler2Redis)) return true
    return super.canActivate(context)
  }
}
