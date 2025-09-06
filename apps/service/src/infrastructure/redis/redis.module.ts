import type { RedisOptions } from 'ioredis'
import type { WinstonLogger } from '@/infrastructure/logger2/logger2.util'
import { DynamicModule, Module, Provider } from '@nestjs/common'
import { initRedis } from './redis.utils'

/** redis动态连接模块配置 */
export interface IRedisModuleOptions {
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
  logger: WinstonLogger
  /** 日志上下文 */
  loggerContext: string
}
/** redis动态连接模块 */
@Module({})
export class RedisModule {
  public static async forRootAsync(options: IRedisModuleOptions): Promise<DynamicModule> {
    const { redisClientToken, inject, useFactory, isGlobal, serviceClass } = options
    const { logger, loggerContext } = options
    const redisClientProvider: Provider = {
      provide: redisClientToken,
      useFactory: async (...args: any[]) => {
        const config = await useFactory(...args)
        const { redisClient } = await initRedis({
          redisConfig: config,
          loggerContext,
          logger,
        })
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
