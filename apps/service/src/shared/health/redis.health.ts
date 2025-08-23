import type { HealthIndicatorResult } from '@nestjs/terminus'
import type Redis from 'ioredis'
import { Injectable } from '@nestjs/common'
import { ConnectionNotFoundError, HealthCheckError, HealthIndicator } from '@nestjs/terminus'
import { redisIsOk } from '@redis/redis.utils'

export interface RedisCheckSettings {
  /** redis实例 */
  connection: Redis
}
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor() {
    super()
  }

  test() {
    throw new Error('test')
  }

  async pingCheck<Key extends string>(key: Key, options: RedisCheckSettings): Promise<HealthIndicatorResult> {
    let isHealthy = false
    try {
      const { connection: redis } = options
      if (!redis) {
        throw new ConnectionNotFoundError(
          this.getStatus(key, isHealthy, {
            message: 'Connection provider not found in application context',
          }),
        )
      }
      const status = redis.status
      if (redisIsOk(redis)) {
        isHealthy = true
        return this.getStatus(key, isHealthy)
      } else {
        throw new HealthCheckError(
          status,
          this.getStatus(key, isHealthy, {
            message: status,
          }),
        )
      }
    } catch (error) {
      throw new HealthCheckError(
        error.message,
        this.getStatus(key, isHealthy, {
          message: error.message,
        }),
      )
    }
  }
}
