import type { Queue } from 'bullmq'
import type Redis from 'ioredis'
import { Cache } from '@nestjs/cache-manager'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'
import { DEFAULT_CACHE_TTL } from '@/configs/constants'

export interface LikeCache2ModuleOptions {
  /** 子类名 */
  className: string
  /** redis缓存实例 */
  redis: Redis
  /** 内存缓存实例 */
  memory: Cache
  /** 队列实例(用于延迟删除,需要提供消费者文件,文件内要注入子类来提供删除方法) */
  queue?: Queue
}
export abstract class LikeCache2Module extends BaseModule {
  redis: Redis
  memory: Cache
  queue?: Queue
  constructor(cache2ModuleOptions: LikeCache2ModuleOptions) {
    const { className, redis, memory, queue } = cache2ModuleOptions
    super(className)
    this.redis = redis
    this.memory = memory
    if (queue) this.queue = queue
  }

  /**
   * 写入缓存
   * @param key 键名
   * @param value 值
   * @param ttl 过期时间(default: 7 * 1000)
   */
  async set(key: string, value: unknown, ttl: number = DEFAULT_CACHE_TTL): Promise<boolean> {
    try {
      const _key = `${this.className}:${key}`
      const _value = JSON.stringify(value)
      await this.memory.set(_key, _value, ttl)
      await this.redis.set(_key, _value, 'PX', ttl)
      return true
    } catch (e) {
      this.logger.error(`${this.set.name}:${e.message}`)
      return false
    }
  }

  /**
   * 获取缓存
   * @param key 键名
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const _key = `${this.className}:${key}`
      const memoryValue = (await this.memory.get<string>(_key)) ?? null
      if (memoryValue) return JSON.parse(memoryValue)
      const ttl = await this.redis.pttl(_key)
      const redisValue = await this.redis.get(_key)
      if (redisValue) {
        const _redisValue = JSON.parse(redisValue)
        this.memory.set(_key, _redisValue, ttl * 0.8)
        return _redisValue
      }
      return null
    } catch (e) {
      this.logger.error(`${this.set.name}:${e.message}`)
      return null
    }
  }

  /**
   * 删除缓存
   * @param key 键名
   */
  async del(key: string): Promise<boolean> {
    try {
      const _key = `${this.className}:${key}`
      await this.memory.del(_key)
      await this.redis.del(_key)
      return true
    } catch (e) {
      this.logger.error(`${this.del.name}:${e.message}`)
      return false
    }
  }

  /**
   * 批量删除缓存
   * @param keys 键名数组
   */
  async delMany(keys: string[]): Promise<boolean> {
    try {
      for (const key of keys) {
        await this.del(key)
      }
      return true
    } catch (e) {
      this.logger.error(`${this.delMany.name}:${e.message}`)
      return false
    }
  }

  /**
   * 更新缓存
   * @param key 键名
   * @param value 更新的值
   */
  async update(key: string, value: unknown): Promise<boolean> {
    try {
      const _key = `${this.className}:${key}`
      const _value = JSON.stringify(value)
      const ttl = await this.redis.pttl(_key)
      const multi = this.redis.multi()
      multi.set(_key, _value)
      this.memory.set(_key, _value, ttl)
      if (ttl > 0) multi.pexpire(_key, ttl)
      await multi.exec()
      return true
    } catch (e) {
      this.logger.error(`${this.update.name}:${e.message}`)
      return false
    }
  }

  /**
   * 延迟删除缓存
   * @param key 键名
   * @param delay 延迟时间(default: 1000)
   */
  async delayedDel(key: string, delay: number = 1000): Promise<boolean> {
    if (!this.queue) {
      this.logger.error(`${this.delayedDel.name}:未提供队列实例`)
      return false
    }
    try {
      await this.queue?.add('delayedDel', { key }, { attempts: 3, delay })
      return true
    } catch (e) {
      this.logger.error(`${this.delayedDel.name}:${e.message}`)
      return false
    }
  }

  /**
   * 批量延迟删除缓存
   * @param keys 键名数组
   * @param delay 延迟时间(default: 1000)
   */
  async delayedDelMany(keys: string[], delay: number = 1000): Promise<boolean> {
    if (!this.queue) {
      this.logger.error(`${this.delayedDelMany.name}:未提供队列实例`)
      return false
    }
    try {
      for (const key of keys) {
        await this.delayedDel(key, delay)
      }
      return true
    } catch (e) {
      this.logger.error(`${this.delayedDelMany.name}:${e.message}`)
      return false
    }
  }
}
