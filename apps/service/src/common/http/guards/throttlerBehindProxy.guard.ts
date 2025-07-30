import type { Request as ExpressRequest } from 'express'
import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { getClientIp } from '@/common/utils'

/** 节流守卫 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  /** 重写获取原始IP */
  protected async getTracker(req: ExpressRequest): Promise<string> {
    return getClientIp(req)
  }
}
