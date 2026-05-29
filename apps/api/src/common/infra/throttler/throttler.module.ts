import type { Redis, RedisOptions } from 'ioredis'
import type { IInitRedisReturn, TRedis } from '@/common/utils'
import type { IThrottlerConfig } from '@/config'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule as nestThrottlerModule } from '@nestjs/throttler'
import { initRedis } from '@/common/utils'
import { THROTTLER_CONFIG_KEY } from '@/config'
import { THROTTLER_REDIS_CLIENT_TOKEN } from './constant'

/** 节流模块 */
@Global()
@Module({
  imports: [
    nestThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { throttlersConfig, storageConfig } = configService.get<IThrottlerConfig>(THROTTLER_CONFIG_KEY)!
        await ThrottlerModule.init(storageConfig as RedisOptions)
        const storage = new ThrottlerStorageRedisService(ThrottlerModule.initRedis!.redisClient as Redis)
        return {
          ...throttlersConfig,
          storage,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: THROTTLER_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService): Promise<TRedis> => {
        const { storageConfig } = configService.get<IThrottlerConfig>(THROTTLER_CONFIG_KEY)!
        await ThrottlerModule.init(storageConfig as RedisOptions)
        return ThrottlerModule.initRedis!.redisClient
      },
      inject: [ConfigService],
    },
  ],
  exports: [nestThrottlerModule, THROTTLER_REDIS_CLIENT_TOKEN],
})
export class ThrottlerModule {
  public static logger: Logger = new Logger(ThrottlerModule.name)
  public static initRedis: IInitRedisReturn | null = null
  private static initPromise: Promise<void> | null = null

  /**
   * 初始化ThrottlerModule
   * @param config Redis配置
   */
  public static async init(config: RedisOptions): Promise<void> {
    if (ThrottlerModule.initRedis) return

    if (!ThrottlerModule.initPromise) {
      ThrottlerModule.initPromise = (async () => {
        config.keyPrefix = `${ThrottlerModule.name}:`
        ThrottlerModule.initRedis = await initRedis({
          redisConfig: config,
          logger: ThrottlerModule.logger,
        })
      })()
    }

    await ThrottlerModule.initPromise
  }
}
