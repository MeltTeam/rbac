import type { CacheOptions } from '@nestjs/cache-manager'
import type { ConfigType } from '@nestjs/config'
import type { RedisOptions } from 'ioredis'
import { registerAs } from '@nestjs/config'
import { CacheValidationSchema } from './validationSchema'

/** cache配置key */
export const CACHE_CONFIG_KEY = 'CACHE_CONFIG_KEY'
export interface CacheOptionsInterface {
  memory: CacheOptions<Record<any, any>>
  redis: {
    connectConfig: RedisOptions
    ttl: number
  }
}

/** cache配置 */
export const CacheConfig = registerAs(CACHE_CONFIG_KEY, (): CacheOptionsInterface => {
  const { error, value } = CacheValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${CacheConfig.name}:${error.message}`)
  return {
    memory: {
      store: value.CACHE_MEMORY_NAME,
      max: value.CACHE_MEMORY_MAX,
      ttl: value.CACHE_MEMORY_TTL,
    },
    redis: {
      connectConfig: {
        host: value.CACHE_REDIS_HOST ?? value.REDIS_HOST,
        port: value.CACHE_REDIS_PORT ?? value.REDIS_PORT,
        username: value.CACHE_REDIS_USERNAME ?? value.REDIS_USERNAME,
        password: value.CACHE_REDIS_PASSWORD ?? value.REDIS_PASSWORD,
        db: value.CACHE_REDIS_DB,
      },
      ttl: value.CACHE_REDIS_TTL,
    },
  }
})

/** cache配置类型 */
export type CacheConfigType = ConfigType<typeof CacheConfig>
