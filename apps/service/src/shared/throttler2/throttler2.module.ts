import type { ThrottlerModuleOptions } from '@nestjs/throttler'
import type { IInitRedisReturn } from '@redis/redis.utils'
import type { Redis, RedisOptions } from 'ioredis'
import type { ThrottlerConfigType } from '@/configs'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { initRedis } from '@redis/redis.utils'
import { WinstonService } from '@winston/winston.service'
import { THROTTLER_CONFIG_KEY } from '@/configs'
import { THROTTLER2_REDIS_CLIENT_TOKEN } from './throttler2.constant'

export class Throttler2ModuleHelper {
  public static instance: Throttler2ModuleHelper
  public logger: WinstonService
  public initRedis: IInitRedisReturn
  private constructor() {}

  public static async create(config: RedisOptions, logger?: WinstonService) {
    if (!Throttler2ModuleHelper.instance) {
      Throttler2ModuleHelper.instance = new Throttler2ModuleHelper()
      Throttler2ModuleHelper.instance.logger = logger || new WinstonService()
      Throttler2ModuleHelper.instance.initRedis = await initRedis({
        redisConfig: config,
        logger: Throttler2ModuleHelper.instance.logger,
        loggerContext: Throttler2Module.name,
      })
    }
    return Throttler2ModuleHelper.instance
  }
}

/** 节流器模块 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { throttlersConfig, storageConfig } = configService.get<ThrottlerConfigType>(`${THROTTLER_CONFIG_KEY}`)!
        const throttler2ModuleHelper = await Throttler2ModuleHelper.create(storageConfig)
        const {
          initRedis: { redisClient },
        } = throttler2ModuleHelper
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
        const throttler2ModuleHelper = await Throttler2ModuleHelper.create(storageConfig)
        const {
          initRedis: { redisClient },
        } = throttler2ModuleHelper
        return redisClient
      },
      inject: [ConfigService],
    },
  ],
  // 导出redis实例
  exports: [THROTTLER2_REDIS_CLIENT_TOKEN],
})
export class Throttler2Module {}
