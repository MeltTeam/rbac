import type { CacheConfigType } from '@/configs'
import { CacheModule as Cache2Module } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CACHE_CONFIG_KEY } from '@/configs'
import { RedisModule } from '../redis/redis.module'
import { CacheService } from './cache.service'
import { CACHE_REDIS_CLIENT_TOKEN } from './constants'
import { CacheProcessor } from './processors/cache.processor'

/** 内存缓存模块 */
@Module({
  imports: [
    /** Memory 缓存模块 */
    Cache2Module.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const { memory } = configService.get<CacheConfigType>(CACHE_CONFIG_KEY)!
        return memory
      },
      inject: [ConfigService],
    }),
    /** Redis 缓存模块 */
    RedisModule.forRootAsync({
      isGlobal: true,
      serviceClass: [CacheService],
      redisClientToken: CACHE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const {
          redis: { connectConfig },
        } = configService.get<CacheConfigType>(CACHE_CONFIG_KEY)!
        return connectConfig
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService, CacheProcessor],
  exports: [CacheService, CacheProcessor],
})
export class CacheModule {}
