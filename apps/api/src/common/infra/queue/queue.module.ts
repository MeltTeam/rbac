import type { RedisOptions } from 'ioredis'
import type { IInitRedisReturn, TRedis } from '@/common/utils'
import type { IQueueConfig } from '@/config'
import { BullModule } from '@nestjs/bullmq'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { initRedis } from '@/common/utils'
import { QUEUE_CONFIG_KEY } from '@/config'
import { CACHE_QUEUE_TOKEN, EMAIL_QUEUE_TOKEN, LOGGING_QUEUE_TOKEN, QUEUE_REDIS_CLIENT_TOKEN } from './constant'

/** 队列模块 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IQueueConfig>(QUEUE_CONFIG_KEY)!
        await QueueModule.init(config.connection as RedisOptions)
        config.connection = QueueModule.initRedis!.redisConfig!
        return config
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync(
      {
        name: CACHE_QUEUE_TOKEN,
      },
      {
        name: EMAIL_QUEUE_TOKEN,
      },
      {
        name: LOGGING_QUEUE_TOKEN,
      },
    ),
  ],
  providers: [
    {
      provide: QUEUE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService): Promise<TRedis> => {
        const config = configService.get<IQueueConfig>(QUEUE_CONFIG_KEY)!
        await QueueModule.init(config.connection as RedisOptions)
        return QueueModule.initRedis!.redisClient
      },
      inject: [ConfigService],
    },
  ],
  exports: [BullModule, QUEUE_REDIS_CLIENT_TOKEN],
})
export class QueueModule {
  public static logger: Logger = new Logger(QueueModule.name)
  public static initRedis: IInitRedisReturn | null = null
  private static initPromise: Promise<void> | null = null

  /**
   * 初始化QueueModule
   * @param config Redis配置
   */
  public static async init(config: RedisOptions): Promise<void> {
    if (QueueModule.initRedis) return

    if (!QueueModule.initPromise) {
      QueueModule.initPromise = (async () => {
        QueueModule.initRedis = await initRedis({
          redisConfig: config,
          logger: QueueModule.logger,
        })
      })()
    }

    await QueueModule.initPromise
  }
}
