import type { ConfigObject } from 'svg-captcha'
import type { CaptchaType, ICaptchaService, ICreateCaptchaKey } from './interfaces/ICaptchaService'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'
import { DEFAULT_CACHE_TTL } from '@/configs/constants'
import { CAPTCHA_REDIS_CLIENT_TOKEN } from './constants'

@Injectable()
export class CaptchaService extends BaseModule implements ICaptchaService {
  @Inject(CACHE_MANAGER)
  memory: Cache

  @Inject(CAPTCHA_REDIS_CLIENT_TOKEN)
  redis: Redis

  constructor() {
    super()
  }

  async set(key: string, value: unknown, ttl: number = DEFAULT_CACHE_TTL) {
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

  async del(key: string) {
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

  async update(key: string, value: unknown) {
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

  createCaptchaKey(_options: ICreateCaptchaKey) {
    return ''
  }

  async generateSvgCaptcha(_type: CaptchaType, _svgCaptchaConfig?: ConfigObject) {
    return {
      token: '',
      svg: '',
    }
  }

  async verifySvgCaptcha(_token: string, _text: string, _type: CaptchaType) {}

  async delSvgCaptcha(_token: string, _type: CaptchaType) {}

  async generateEmailCaptcha(_to: string, _subject: string, _template: string, _type: CaptchaType) {
    return ''
  }

  async verifyEmailCaptcha(_email: string, _code: string, _type: CaptchaType) {}

  async delEmailCaptcha(_email: string, _type: CaptchaType) {}
}
