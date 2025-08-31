import type { APP_CONFIG_KEY, AppConfigType } from './app.config'
import type { CACHE_CONFIG_KEY, CacheConfigType } from './cache.config'
import type { CAPTCHA_CONFIG_KEY, CaptchaConfigType } from './captcha.config'
import type { EMAIL_CONFIG_KEY, EmailConfigType } from './email.config'
import type { JWT_CONFIG_KEY, JwtConfigType } from './jwt.config'
import type { QUEUE_CONFIG_KEY, QueueConfigType } from './queue.config'
import type { THROTTLER_CONFIG_KEY, ThrottlerConfigType } from './throttler.config'
import type { TYPEORM_CONFIG_KEY, TypeOrmConfigType } from './typeOrm.config'
import type { WINSTON_CONFIG_KEY, WinstonConfigType } from './winston.config'
import { AppConfig } from './app.config'
import { CacheConfig } from './cache.config'
import { CaptchaConfig } from './captcha.config'
import { EmailConfig } from './email.config'
import { JwtConfig } from './jwt.config'
import { QueueConfig } from './queue.config'
import { ThrottlerConfig } from './throttler.config'
import { TypeOrmConfig } from './typeOrm.config'
import { WinstonConfig } from './winston.config'

export * from './app.config'
export * from './cache.config'
export * from './captcha.config'
export * from './constants'
export * from './email.config'
export * from './jwt.config'
export * from './queue.config'
export * from './throttler.config'
export * from './typeOrm.config'
export * from './winston.config'

/** 所有配置类型 */
export interface AllConfigType {
  [APP_CONFIG_KEY]: AppConfigType
  [TYPEORM_CONFIG_KEY]: TypeOrmConfigType
  [QUEUE_CONFIG_KEY]: QueueConfigType
  [CACHE_CONFIG_KEY]: CacheConfigType
  [EMAIL_CONFIG_KEY]: EmailConfigType
  [THROTTLER_CONFIG_KEY]: ThrottlerConfigType
  [CAPTCHA_CONFIG_KEY]: CaptchaConfigType
  [JWT_CONFIG_KEY]: JwtConfigType
  [WINSTON_CONFIG_KEY]: WinstonConfigType
}

/** 所有配置 */
export const ALL_CONFIG = {
  AppConfig,
  TypeOrmConfig,
  QueueConfig,
  CacheConfig,
  EmailConfig,
  ThrottlerConfig,
  CaptchaConfig,
  JwtConfig,
  WinstonConfig,
}
