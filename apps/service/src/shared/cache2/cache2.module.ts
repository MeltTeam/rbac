import type { CacheConfigType } from '@/configs'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CACHE_CONFIG_KEY } from '@/configs'
import { RedisModule } from '../redis/redis.module'
import { Cache2Service } from './cache2.service'
import { CACHE_REDIS_CLIENT_TOKEN } from './constants'
import { Cache2Processor } from './processors/cache2.processor'

/** 内存缓存模块 */
@Module({
  imports: [
    /** Memory 缓存模块 */
    CacheModule.registerAsync({
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
      serviceClass: [Cache2Service],
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
  providers: [Cache2Service, Cache2Processor],
  exports: [Cache2Service, Cache2Processor],
})
export class Cache2Module {}
