import type { Logger } from '@nestjs/common'
import type { RedisClient } from 'bullmq'
import type { Cluster, RedisOptions } from 'ioredis'
import { Redis } from 'ioredis'
import {
  DEFAULT_REDIS_COMMAND_TIMEOUT,
  DEFAULT_REDIS_CONNECT_TIMEOUT,
  DEFAULT_REDIS_ENABLE_AUTO_PIPELINING,
  DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE,
  DEFAULT_REDIS_KEEP_ALIVE,
} from '@/configs'

export interface IInitRedisReturn {
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
export async function initRedis(redisConfig: RedisOptions, logger?: Logger): Promise<IInitRedisReturn> {
  /** 统一配置 */
  redisConfig!.enableAutoPipelining = DEFAULT_REDIS_ENABLE_AUTO_PIPELINING
  redisConfig!.commandTimeout = DEFAULT_REDIS_COMMAND_TIMEOUT
  redisConfig!.connectTimeout = DEFAULT_REDIS_CONNECT_TIMEOUT
  redisConfig!.enableOfflineQueue = DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE
  redisConfig!.keepAlive = DEFAULT_REDIS_KEEP_ALIVE
  redisConfig!.retryStrategy = (times) => {
    return Math.min(times * 500, 5000)
  }
  redisConfig!.reconnectOnError = (error) => {
    const recoverableErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT']
    return recoverableErrors.some((e) => error.message.includes(e))
  }
  const redisClient = new Redis(redisConfig)
  if (logger) {
    const redisInfo: string = `redis${redisConfig.db} `
    redisClient.on('end', () => logger.warn(`${redisInfo}连接已手动关闭`))
    redisClient.on('connect', () => logger.log(`${redisInfo}连接成功`))
    redisClient.on('error', (error) => logger.error(`${redisInfo}${error.message}`))
    redisClient.on('connecting', () => logger.warn(`${redisInfo}连接中...`))
    redisClient.on('reconnecting', () => logger.warn(`${redisInfo}重新连接中...`))
    redisClient.on('close', () => logger.warn(`${redisInfo}连接已关闭`))
  }
  return { redisClient, redisConfig }
}

/**
 * 判断当前redis实例是否可用
 * @param redisClient redis实例
 */
export function redisIsOk(redisClient: Redis | RedisClient) {
  return redisClient.status === 'ready' || redisClient.status === 'connect'
}
