import type { Queue } from 'bullmq'
import type Redis from 'ioredis'
import { InjectQueue } from '@nestjs/bullmq'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import { Cache2Module } from './Cache2Module.abstract'
import { CACHE_REDIS_CLIENT_TOKEN } from './constants'

export class CacheService extends Cache2Module {
  constructor(@Inject(CACHE_REDIS_CLIENT_TOKEN) readonly redis: Redis, @Inject(CACHE_MANAGER) readonly memory: Cache, @InjectQueue('cache') readonly cacheQueue: Queue) {
    super({
      className: CacheService.name,
      redis,
      memory,
      queue: cacheQueue,
    })
  }
}
