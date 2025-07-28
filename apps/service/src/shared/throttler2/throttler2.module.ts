import type { ThrottlerModuleOptions } from '@nestjs/throttler'
import type Redis from 'ioredis'
import type { ThrottlerConfigType } from '@/configs'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule as Throttler2Module } from '@nestjs/throttler'
import { initRedis } from '@/common/utils'
import { THROTTLER_CONFIG_KEY } from '@/configs'

/** 节流模块(连redis的db0) */
@Module({
  imports: [
    Throttler2Module.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(ThrottlerModule.name)
        const { storageConfig, throttlersConfig } = configService.get<ThrottlerConfigType>(`${THROTTLER_CONFIG_KEY}`)!
        try {
          const { redisClient } = initRedis(storageConfig, logger)
          const storage = new ThrottlerStorageRedisService(redisClient as Redis)
          const config: ThrottlerModuleOptions = {
            ...throttlersConfig,
            storage,
          }
          return config
        } catch (e) {
          logger.error(`redis连接失败:${e.message}`)
          throw e
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class ThrottlerModule {}
