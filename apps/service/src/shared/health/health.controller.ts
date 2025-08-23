import { CACHE_REDIS_CLIENT_TOKEN } from '@cache2/cache2.constant'
import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common'
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { Throttle } from '@nestjs/throttler'
import { QUEUE_REDIS_CLIENT_TOKEN } from '@queues/queues.constant'
import { THROTTLER2_REDIS_CLIENT_TOKEN } from '@throttler2/throttler2.constant'
import Redis from 'ioredis'
import { SystemException } from '@/common/exceptions'
import { RedisHealthIndicator } from './redis.health'

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly redisHealthIndicator: RedisHealthIndicator,
    @Inject(THROTTLER2_REDIS_CLIENT_TOKEN) private readonly throttler2Redis: Redis,
    @Inject(QUEUE_REDIS_CLIENT_TOKEN) private readonly queueRedis: Redis,
    @Inject(CACHE_REDIS_CLIENT_TOKEN) private readonly cache2Redis: Redis,
  ) {}

  @Throttle({
    default: {
      ttl: 3000,
      limit: 3,
    },
  })
  @Get('all')
  async checkAll() {
    try {
      const res = await this.healthCheckService.check([
        async () => this.memoryHealthIndicator.checkHeap('memory_heap', 200 * 1024 * 1024),
        async () => this.memoryHealthIndicator.checkRSS('memory_rss', 3000 * 1024 * 1024),
        async () =>
          this.diskHealthIndicator.checkStorage('storage', {
            thresholdPercent: 0.5,
            path: 'C:\\',
          }),
        // 节流器
        async () =>
          this.redisHealthIndicator.pingCheck('throttler', {
            connection: this.throttler2Redis,
          }),
        // 队列
        async () =>
          this.redisHealthIndicator.pingCheck('queue', {
            connection: this.queueRedis,
          }),
        // 缓存
        async () =>
          this.redisHealthIndicator.pingCheck('cache', {
            connection: this.cache2Redis,
          }),
        // 数据库
        () => this.typeOrmHealthIndicator.pingCheck('database'),
      ])
      return res
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        return error.getResponse()
      }
      throw error
    }
  }

  @Get()
  async a() {
    try {
      this.redisHealthIndicator.test()
    } catch (error) {
      throw new SystemException({
        error,
      })
    }
  }
}
