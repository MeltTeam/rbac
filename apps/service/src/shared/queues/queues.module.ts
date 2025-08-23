import type { IInitRedisReturn } from '@redis/redis.utils'
import type { Redis, RedisOptions } from 'ioredis'
import type { QueueConfigType } from '@/configs'
import { BullModule } from '@nestjs/bullmq'
import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { initRedis } from '@redis/redis.utils'
import { QUEUE_CONFIG_KEY } from '@/configs'
import { CACHE_QUEUE_TOKEN, EMAIL_QUEUE_TOKEN, QUEUE_REDIS_CLIENT_TOKEN } from './queues.constant'

/** 队列模块 */
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(QueuesModule.name)
        const config = configService.get<QueueConfigType>(QUEUE_CONFIG_KEY)!
        const { redisConfig } = await QueuesModule.getRedisClient(config.connection as RedisOptions, logger)
        config.connection = redisConfig
        return config
      },
      inject: [ConfigService],
    }),
    /** 注册队列 */
    BullModule.registerQueueAsync(
      {
        name: CACHE_QUEUE_TOKEN,
      },
      {
        name: EMAIL_QUEUE_TOKEN,
      },
    ),
  ],
  providers: [
    {
      provide: QUEUE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<QueueConfigType>(QUEUE_CONFIG_KEY)!
        const { redisClient } = await QueuesModule.getRedisClient(config.connection as RedisOptions)
        return redisClient
      },
      inject: [ConfigService],
    },
  ],
  // 导出redis实例
  exports: [BullModule, QUEUE_REDIS_CLIENT_TOKEN],
})
export class QueuesModule {
  // 单例
  private static _redisClient: Redis
  private static _redisConfig: RedisOptions

  static async getRedisClient(config: RedisOptions, logger?: Logger): Promise<IInitRedisReturn> {
    if (!QueuesModule._redisClient) {
      const { redisClient, redisConfig } = await initRedis(config, logger)

      QueuesModule._redisClient = redisClient as Redis
      QueuesModule._redisConfig = redisConfig
    }
    return {
      redisClient: QueuesModule._redisClient,
      redisConfig: QueuesModule._redisConfig,
    }
  }
}
