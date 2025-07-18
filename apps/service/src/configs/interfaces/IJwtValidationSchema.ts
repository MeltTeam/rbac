import type { IBaseValidationSchema } from './IBaseValidationSchema'

export interface IJwtValidationSchema extends IBaseValidationSchema {
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  JWT_REDIS_HOST?: string
  JWT_REDIS_PORT?: number
  JWT_REDIS_USERNAME?: string
  JWT_REDIS_PASSWORD?: string
  JWT_REDIS_DB: number
  JWT_ACCESS_TOKEN_EXPIRES_IN: string
  JWT_REFRESH_TOKEN_EXPIRES_IN: string
  JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN: number
  JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN: number
}
