import type { RedisOptions } from 'ioredis'
import type { QueueConfigType } from '@/configs'
import type { IInitRedisReturn } from '@/infrastructure/redis/redis.utils'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QUEUE_CONFIG_KEY } from '@/configs'
import { WinstonLogger } from '@/infrastructure/logger2/logger2.util'
import { initRedis } from '@/infrastructure/redis/redis.utils'
import { CACHE_QUEUE_TOKEN, EMAIL_QUEUE_TOKEN, LOGGER_QUEUE_TOKEN, QUEUE_REDIS_CLIENT_TOKEN } from './queues.constant'

export class QueuesModuleHelper {
  public static instance: QueuesModuleHelper
  public logger: WinstonLogger
  public initRedis: IInitRedisReturn
  private constructor() {}

  public static async create(config: RedisOptions, logger?: WinstonLogger) {
    if (!QueuesModuleHelper.instance) {
      QueuesModuleHelper.instance = new QueuesModuleHelper()
      QueuesModuleHelper.instance.logger = logger || new WinstonLogger()
      QueuesModuleHelper.instance.initRedis = await initRedis({
        redisConfig: config,
        logger: QueuesModuleHelper.instance.logger,
        loggerContext: QueuesModule.name,
      })
    }
    return QueuesModuleHelper.instance
  }
}
/** 队列模块 */
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<QueueConfigType>(QUEUE_CONFIG_KEY)!
        const queuesModuleHelper = await QueuesModuleHelper.create(config.connection as RedisOptions)
        const {
          initRedis: { redisConfig },
        } = queuesModuleHelper
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
      {
        name: LOGGER_QUEUE_TOKEN,
      },
    ),
  ],
  providers: [
    {
      provide: QUEUE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<QueueConfigType>(QUEUE_CONFIG_KEY)!
        const queuesModuleHelper = await QueuesModuleHelper.create(config.connection as RedisOptions)
        const {
          initRedis: { redisClient },
        } = queuesModuleHelper
        return redisClient
      },
      inject: [ConfigService],
    },
  ],
  // 导出redis实例
  exports: [BullModule, QUEUE_REDIS_CLIENT_TOKEN],
})
export class QueuesModule {}
