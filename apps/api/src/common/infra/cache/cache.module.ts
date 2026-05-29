import type { RedisOptions } from 'ioredis'
import type { Redis as IOValkey } from 'iovalkey'
import type { IInitRedisReturn, TRedis } from '@/common/utils'
import type { ICacheConfig } from '@/config'
import KeyvValkey from '@keyv/valkey'
import { CacheModule as nestCacheModule } from '@nestjs/cache-manager'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KeyvCacheableMemory } from 'cacheable'
import { Keyv } from 'keyv'
import { initRedis } from '@/common/utils'
import { CACHE_CONFIG_KEY } from '@/config'
import { CacheProcessor } from './cache.processor'
import { CacheService } from './cache.service'
import { CACHE_REDIS_CLIENT_TOKEN } from './constant'

/** 缓存模块 */
@Global()
@Module({
  imports: [
    nestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const { memory, redis: { ttl, ...config } } = configService.get<ICacheConfig>(CACHE_CONFIG_KEY)!
        const L1 = new Keyv({ store: new KeyvCacheableMemory({ ttl: memory.ttl, lruSize: memory.lruSize }) })
        await CacheModule.init(config as RedisOptions)
        const store = new KeyvValkey(CacheModule.initRedis!.redisClient as IOValkey, { useRedisSets: false })
        const L2 = new Keyv({ store })
        return {
          stores: [L1, L2],
          ttl,
          nonBlocking: true,
          refreshAllStores: true,
          refreshThreshold: memory.ttl * 0.1,
          cacheId: CacheModule.name,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: CACHE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService): Promise<TRedis> => {
        const { redis: { ttl: _, ...storageConfig } } = configService.get<ICacheConfig>(CACHE_CONFIG_KEY)!
        await CacheModule.init(storageConfig as RedisOptions)
        return CacheModule.initRedis!.redisClient
      },
      inject: [ConfigService],
    },
    CacheService,
    CacheProcessor,
  ],
  exports: [CacheService, CacheProcessor, CACHE_REDIS_CLIENT_TOKEN],
})
export class CacheModule {
  public static logger: Logger = new Logger(CacheModule.name)
  public static initRedis: IInitRedisReturn | null = null
  private static initPromise: Promise<void> | null = null

  /**
   * 初始化CacheModule
   * @param config Redis配置
   */
  public static async init(config: RedisOptions): Promise<void> {
    if (CacheModule.initRedis) return

    if (!CacheModule.initPromise) {
      CacheModule.initPromise = (async () => {
        config.keyPrefix = `${CacheModule.name}:`
        CacheModule.initRedis = await initRedis({
          redisConfig: config,
          logger: CacheModule.logger,
        })
      })()
    }

    await CacheModule.initPromise
  }
}
