import type { RedisOptions } from 'ioredis'
import type { QueueConfigType } from '@/configs'
import { BullModule } from '@nestjs/bullmq'
import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { initRedis } from '@/common/utils'
import { QUEUE_CONFIG_KEY } from '@/configs'

/** 队列模块 */
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(QueuesModule.name)
        const config = configService.get<QueueConfigType>(QUEUE_CONFIG_KEY)!
        /** 测试连接 */
        const { redisClient } = initRedis(config.connection as RedisOptions, logger)
        /** 手动关闭 */
        redisClient.disconnect()
        return config
      },
      inject: [ConfigService],
    }),
    /** 注册队列 */
    BullModule.registerQueueAsync(
      {
        name: 'cache',
      },
      {
        name: 'email',
      },
    ),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
