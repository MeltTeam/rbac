import type { CacheConfigType } from '@/configs'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisModule } from '@redis/redis.module'
import { CACHE_CONFIG_KEY } from '@/configs'
import { WinstonService } from '../winston/winston.service'
import { CACHE_REDIS_CLIENT_TOKEN } from './cache2.constant'
import { Cache2Processor } from './cache2.processor'
import { Cache2Service } from './cache2.service'

/** 缓存模块 */
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
      logger: Cache2Module.logger,
      loggerContext: Cache2Module.name,
    }),
  ],
  providers: [Cache2Service, Cache2Processor],
  exports: [Cache2Service, Cache2Processor],
})
export class Cache2Module {
  static logger: WinstonService = new WinstonService()
}
