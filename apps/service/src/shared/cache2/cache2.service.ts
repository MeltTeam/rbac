import type { Queue } from 'bullmq'
import type Redis from 'ioredis'
import { InjectQueue } from '@nestjs/bullmq'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import { CACHE_REDIS_CLIENT_TOKEN } from './constants'
import { LikeCache2Module } from './LikeCache2Module.abstract'

export class Cache2Service extends LikeCache2Module {
  constructor(
    @Inject(CACHE_REDIS_CLIENT_TOKEN) readonly redis: Redis,
    @Inject(CACHE_MANAGER) readonly memory: Cache,
    @InjectQueue('cache') readonly cacheQueue: Queue,
  ) {
    super({
      className: Cache2Service.name,
      redis,
      memory,
      queue: cacheQueue,
    })
  }
}
