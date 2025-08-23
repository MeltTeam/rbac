import type { RedisOptions } from 'ioredis'
import { DynamicModule, Logger, Module, Provider } from '@nestjs/common'
import { initRedis } from './redis.utils'

/** redis动态连接模块配置 */
export interface RedisModuleOptions {
  /** 返回redisClient的配置 */
  useFactory: (...args: any[]) => Promise<RedisOptions>
  /** 是否为全局模块 */
  isGlobal?: boolean
  inject?: any[]
  /** redisClient服务的token */
  redisClientToken: string | symbol
  /** 为哪些service模块提供redisClient */
  serviceClass: any[]
  /** 日志实例 */
  logger?: Logger
}
/** redis动态连接模块 */
@Module({})
export class RedisModule {
  static forRootAsync(options: RedisModuleOptions): DynamicModule {
    const { redisClientToken, inject, useFactory, isGlobal, serviceClass } = options
    let { logger } = options
    const redisClientProvider: Provider = {
      provide: redisClientToken,
      useFactory: async (...args: any[]) => {
        const config = await useFactory(...args)
        if (!logger) logger = new Logger(RedisModule.name)
        const { redisClient } = await initRedis(config, logger)
        return redisClient
      },
      inject: inject || [],
    }

    return {
      global: isGlobal !== false,
      module: RedisModule,
      providers: [...serviceClass, redisClientProvider],
      exports: [...serviceClass, redisClientToken],
    }
  }
}
