import type { ThrottlerModuleOptions } from '@nestjs/throttler'
import type { IInitRedisReturn } from '@redis/redis.utils'
import type { Redis, RedisOptions } from 'ioredis'
import type { ThrottlerConfigType } from '@/configs'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { initRedis } from '@redis/redis.utils'
import { THROTTLER_CONFIG_KEY } from '@/configs'
import { THROTTLER2_REDIS_CLIENT_TOKEN } from './throttler2.constant'

/** 节流器模块 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(Throttler2Module.name)
        const { throttlersConfig, storageConfig } = configService.get<ThrottlerConfigType>(`${THROTTLER_CONFIG_KEY}`)!
        const { redisClient } = await Throttler2Module.getRedisClient(storageConfig, logger)
        const storage = new ThrottlerStorageRedisService(redisClient as Redis)
        const config: ThrottlerModuleOptions = {
          ...throttlersConfig,
          storage,
        }
        return config
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: THROTTLER2_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const { storageConfig } = configService.get<ThrottlerConfigType>(`${THROTTLER_CONFIG_KEY}`)!
        const { redisClient } = await Throttler2Module.getRedisClient(storageConfig)
        return redisClient
      },
      inject: [ConfigService],
    },
  ],
  // 导出redis实例
  exports: [THROTTLER2_REDIS_CLIENT_TOKEN],
})
export class Throttler2Module {
  // 单例
  private static _redisClient: Redis
  private static _redisConfig: RedisOptions

  static async getRedisClient(config: RedisOptions, logger?: Logger): Promise<IInitRedisReturn> {
    if (!Throttler2Module._redisClient) {
      const { redisClient, redisConfig } = await initRedis(config, logger)

      Throttler2Module._redisClient = redisClient as Redis
      Throttler2Module._redisConfig = redisConfig
    }
    return {
      redisClient: Throttler2Module._redisClient,
      redisConfig: Throttler2Module._redisConfig,
    }
  }
}
