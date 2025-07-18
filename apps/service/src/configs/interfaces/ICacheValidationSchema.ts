import type { IBaseValidationSchema } from './IBaseValidationSchema'

export interface ICacheValidationSchema extends IBaseValidationSchema {
  CACHE_MEMORY_NAME: string
  CACHE_MEMORY_MAX: number
  CACHE_MEMORY_TTL: number
  CACHE_REDIS_HOST?: string
  CACHE_REDIS_PORT?: number
  CACHE_REDIS_USERNAME?: string
  CACHE_REDIS_PASSWORD?: string
  CACHE_REDIS_DB: number
  CACHE_REDIS_TTL: number
}
