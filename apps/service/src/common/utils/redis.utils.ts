import type { Logger } from '@nestjs/common'
import type { Cluster, RedisOptions } from 'ioredis'
import { Redis } from 'ioredis'

export interface IinitRedisReturn {
  /** redis实例 */
  redisClient: Redis | Cluster
  /** redis配置对象 */
  redisConfig: RedisOptions
}
/**
 * 初始化Redis客户端
 * @param redisConfig Redis客户端配置对象
 * @param logger 日志记录器
 * @returns 返回初始化后的Redis客户端实例
 */
export function initRedis(redisConfig: RedisOptions, logger: Logger): IinitRedisReturn {
  /** 统一配置 */
  redisConfig!.enableAutoPipelining = true
  redisConfig!.commandTimeout = 30000
  redisConfig!.connectTimeout = 3000
  redisConfig!.enableOfflineQueue = false
  redisConfig!.keepAlive = 30000
  redisConfig!.retryStrategy = (retries) => Math.min(retries * 100, 5000)
  redisConfig!.reconnectOnError = (err) => {
    const recoverableErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT']
    return recoverableErrors.some((e) => err.message.includes(e))
  }
  const redisClient = new Redis(redisConfig)
  redisClient.on('error', (err: any) => {
    logger.error(`redis错误:${err.message}`)
    if (err.code === 'ECONNRESET') {
      logger.warn('redis连接断开，尝试重连...')
      redisClient.connect().then(
        () => logger.warn('重连成功'),
        (e) => logger.error('重连失败:', e),
      )
    }
  })
  redisClient.on('end', () => logger.warn('redis连接已手动关闭'))
  redisClient.on('connect', () => logger.log('redis连接成功'))
  return { redisClient, redisConfig }
}
