import type { APP_CONFIG_KEY, AppConfigType } from './app.config'
import type { CACHE_CONFIG_KEY, CacheConfigType } from './cache.config'
import type { CAPTCHA_CONFIG_KEY, CaptchaConfigType } from './captcha.config'
import type { CORS_CONFIG_KEY, CorsConfigType } from './cors.config'
import type { EMAIL_CONFIG_KEY, EmailConfigType } from './email.config'
import type { HELMET_CONFIG_KEY, HelmetConfigType } from './helmet.config'
import type { JWT_CONFIG_KEY, JwtConfigType } from './jwt.config'
import type { LOGGER_CONFIG_KEY, LoggerConfigType } from './logger.config'
import type { ORM_CONFIG_KEY, OrmConfigType } from './orm.config'
import type { QUEUE_CONFIG_KEY, QueueConfigType } from './queue.config'
import type { SWAGGER_CONFIG_KEY, SwaggerConfigType } from './swagger.config'
import type { THROTTLER_CONFIG_KEY, ThrottlerConfigType } from './throttler.config'
import { AppConfig } from './app.config'
import { CacheConfig } from './cache.config'
import { CaptchaConfig } from './captcha.config'
import { CorsConfig } from './cors.config'
import { EmailConfig } from './email.config'
import { HelmetConfig } from './helmet.config'
import { JwtConfig } from './jwt.config'
import { LoggerConfig } from './logger.config'
import { OrmConfig } from './orm.config'
import { QueueConfig } from './queue.config'
import { SwaggerConfig } from './swagger.config'
import { ThrottlerConfig } from './throttler.config'

export * from './app.config'
export * from './cache.config'
export * from './captcha.config'
export * from './constants'
export * from './cors.config'
export * from './email.config'
export * from './helmet.config'
export * from './jwt.config'
export * from './logger.config'
export * from './orm.config'
export * from './queue.config'
export * from './swagger.config'
export * from './throttler.config'

/** 所有配置类型 */
export interface AllConfigType {
  [APP_CONFIG_KEY]: AppConfigType
  [ORM_CONFIG_KEY]: OrmConfigType
  [QUEUE_CONFIG_KEY]: QueueConfigType
  [CACHE_CONFIG_KEY]: CacheConfigType
  [EMAIL_CONFIG_KEY]: EmailConfigType
  [THROTTLER_CONFIG_KEY]: ThrottlerConfigType
  [CAPTCHA_CONFIG_KEY]: CaptchaConfigType
  [JWT_CONFIG_KEY]: JwtConfigType
  [LOGGER_CONFIG_KEY]: LoggerConfigType
  [CORS_CONFIG_KEY]: CorsConfigType
  [SWAGGER_CONFIG_KEY]: SwaggerConfigType
  [HELMET_CONFIG_KEY]: HelmetConfigType
}

/** 所有配置 */
export const ALL_CONFIG = {
  AppConfig,
  OrmConfig,
  QueueConfig,
  CacheConfig,
  EmailConfig,
  ThrottlerConfig,
  CaptchaConfig,
  JwtConfig,
  LoggerConfig,
  CorsConfig,
  SwaggerConfig,
  HelmetConfig,
}
