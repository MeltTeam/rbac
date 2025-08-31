import type {
  IAppValidationSchema,
  IBaseValidationSchema,
  ICacheValidationSchema,
  ICaptchaValidationSchema,
  IEmailValidationSchema,
  IJwtValidationSchema,
  IQueueValidationSchema,
  IThrottlerValidationSchema,
  ITypeOrmValidationSchema,
  IWinstonValidationSchema,
} from './interfaces'
import Joi from 'joi'
import {
  DEFAULT_APP_CORS_CREDENTIALS,
  DEFAULT_APP_CORS_HEADERS,
  DEFAULT_APP_CORS_MAX_AGE,
  DEFAULT_APP_CORS_METHODS,
  DEFAULT_APP_CORS_ORIGINS,
  DEFAULT_APP_GLOBAL_PREFIX,
  DEFAULT_APP_HOSTNAME,
  DEFAULT_APP_NAME,
  DEFAULT_APP_PORT,
  DEFAULT_APP_SALT,
  DEFAULT_CACHE_MEMORY_MAX,
  DEFAULT_CACHE_MEMORY_NAME,
  DEFAULT_CACHE_MEMORY_TTL,
  DEFAULT_CACHE_REDIS_DB,
  DEFAULT_CACHE_REDIS_TTL,
  DEFAULT_CAPTCHA_REDIS_DB,
  DEFAULT_EMAIL_HOST,
  DEFAULT_EMAIL_PORT,
  DEFAULT_EMAIL_SECURE,
  DEFAULT_EMAIL_TEMPLATE_DIR,
  DEFAULT_JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN,
  DEFAULT_JWT_ACCESS_TOKEN_EXPIRES_IN,
  DEFAULT_JWT_EXPIRES_IN,
  DEFAULT_JWT_REDIS_DB,
  DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  DEFAULT_JWT_SECRET,
  DEFAULT_ORM_AUTO_LOAD_ENTITIES,
  DEFAULT_ORM_CHARSET,
  DEFAULT_ORM_CONNECTOR_PACKAGE,
  DEFAULT_ORM_DATABASE,
  DEFAULT_ORM_HOST,
  DEFAULT_ORM_LOGGING,
  DEFAULT_ORM_PASSWORD,
  DEFAULT_ORM_POOL_SIZE,
  DEFAULT_ORM_PORT,
  DEFAULT_ORM_RETRY_ATTEMPTS,
  DEFAULT_ORM_RETRY_DELAY,
  DEFAULT_ORM_SYNCHRONIZE,
  DEFAULT_ORM_TIMEZONE,
  DEFAULT_ORM_TYPE,
  DEFAULT_ORM_USERNAME,
  DEFAULT_QUEUE_DB,
  DEFAULT_REDIS_HOST,
  DEFAULT_REDIS_PASSWORD,
  DEFAULT_REDIS_PORT,
  DEFAULT_REDIS_USERNAME,
  DEFAULT_THROTTLER_DEFAULT_LIMIT,
  DEFAULT_THROTTLER_DEFAULT_NAME,
  DEFAULT_THROTTLER_DEFAULT_TTL,
  DEFAULT_THROTTLER_LONG_LIMIT,
  DEFAULT_THROTTLER_LONG_NAME,
  DEFAULT_THROTTLER_LONG_TTL,
  DEFAULT_THROTTLER_REDIS_DB,
  DEFAULT_THROTTLER_STRICT_LIMIT,
  DEFAULT_THROTTLER_STRICT_NAME,
  DEFAULT_THROTTLER_STRICT_TTL,
  DEFAULT_WINSTON_DATE_PATTERN,
  DEFAULT_WINSTON_DIRNAME,
  DEFAULT_WINSTON_FILENAME,
  DEFAULT_WINSTON_LEVEL,
  DEFAULT_WINSTON_MAX_FILES,
  DEFAULT_WINSTON_MAX_SIZE,
} from './constants'
import { LEVEL_TYPE } from './interfaces'

/** 公共配置验证 */
export const BaseValidationSchema = Joi.object<IBaseValidationSchema>({
  REDIS_HOST: Joi.string().default(DEFAULT_REDIS_HOST),
  REDIS_PORT: Joi.number().default(DEFAULT_REDIS_PORT),
  REDIS_USERNAME: Joi.string().default(DEFAULT_REDIS_USERNAME),
  REDIS_PASSWORD: Joi.string().default(DEFAULT_REDIS_PASSWORD),
})

/** app配置验证 */
export const AppValidationSchema = BaseValidationSchema.append<IAppValidationSchema>({
  APP_NAME: Joi.string().default(DEFAULT_APP_NAME),
  APP_PORT: Joi.number().default(DEFAULT_APP_PORT),
  APP_HOSTNAME: Joi.string().default(DEFAULT_APP_HOSTNAME),
  APP_GLOBAL_PREFIX: Joi.string().default(DEFAULT_APP_GLOBAL_PREFIX),
  APP_SALT: Joi.string().default(DEFAULT_APP_SALT),
  APP_CORS_ORIGINS: Joi.string().default(DEFAULT_APP_CORS_ORIGINS),
  APP_CORS_METHODS: Joi.string().default(DEFAULT_APP_CORS_METHODS),
  APP_CORS_HEADERS: Joi.string().default(DEFAULT_APP_CORS_HEADERS),
  APP_CORS_CREDENTIALS: Joi.boolean().default(DEFAULT_APP_CORS_CREDENTIALS),
  APP_CORS_MAX_AGE: Joi.number().default(DEFAULT_APP_CORS_MAX_AGE),
})

/** cache配置验证 */
export const CacheValidationSchema = BaseValidationSchema.append<ICacheValidationSchema>({
  CACHE_MEMORY_NAME: Joi.string().default(DEFAULT_CACHE_MEMORY_NAME),
  CACHE_MEMORY_MAX: Joi.number().default(DEFAULT_CACHE_MEMORY_MAX),
  CACHE_MEMORY_TTL: Joi.number().default(DEFAULT_CACHE_MEMORY_TTL),
  CACHE_REDIS_HOST: Joi.string(),
  CACHE_REDIS_PORT: Joi.number(),
  CACHE_REDIS_USERNAME: Joi.string(),
  CACHE_REDIS_PASSWORD: Joi.string(),
  CACHE_REDIS_DB: Joi.number().min(0).max(15).default(DEFAULT_CACHE_REDIS_DB),
  CACHE_REDIS_TTL: Joi.number().default(DEFAULT_CACHE_REDIS_TTL),
})

/** captcha配置验证 */
export const CaptchaValidationSchema = BaseValidationSchema.append<ICaptchaValidationSchema>({
  CAPTCHA_REDIS_HOST: Joi.string(),
  CAPTCHA_REDIS_PORT: Joi.number(),
  CAPTCHA_REDIS_USERNAME: Joi.string(),
  CAPTCHA_REDIS_PASSWORD: Joi.string(),
  CAPTCHA_REDIS_DB: Joi.number().min(0).max(15).default(DEFAULT_CAPTCHA_REDIS_DB),
})

/** jwt配置验证 */
export const JwtValidationSchema = BaseValidationSchema.append<IJwtValidationSchema>({
  JWT_SECRET: Joi.string().default(DEFAULT_JWT_SECRET),
  JWT_EXPIRES_IN: Joi.string().default(DEFAULT_JWT_EXPIRES_IN),
  JWT_REDIS_HOST: Joi.string(),
  JWT_REDIS_PORT: Joi.number(),
  JWT_REDIS_USERNAME: Joi.string(),
  JWT_REDIS_PASSWORD: Joi.string(),
  JWT_REDIS_DB: Joi.number().min(0).max(15).default(DEFAULT_JWT_REDIS_DB),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default(DEFAULT_JWT_ACCESS_TOKEN_EXPIRES_IN),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default(DEFAULT_JWT_ACCESS_TOKEN_EXPIRES_IN),
  JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN: Joi.number().default(DEFAULT_JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN),
  JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN: Joi.number().default(DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN),
})

/** 队列配置验证 */
export const QueueValidationSchema = BaseValidationSchema.append<IQueueValidationSchema>({
  QUEUE_HOST: Joi.string(),
  QUEUE_PORT: Joi.number(),
  QUEUE_USERNAME: Joi.string(),
  QUEUE_PASSWORD: Joi.string(),
  QUEUE_DB: Joi.number().min(0).max(15).default(DEFAULT_QUEUE_DB),
})

/** 节流配置验证 */
export const ThrottlerValidationSchema = BaseValidationSchema.append<IThrottlerValidationSchema>({
  THROTTLER_REDIS_HOST: Joi.string(),
  THROTTLER_REDIS_PORT: Joi.number(),
  THROTTLER_REDIS_USERNAME: Joi.string(),
  THROTTLER_REDIS_PASSWORD: Joi.string(),
  THROTTLER_REDIS_DB: Joi.number().min(0).max(15).default(DEFAULT_THROTTLER_REDIS_DB),

  THROTTLER_DEFAULT_NAME: Joi.string().default(DEFAULT_THROTTLER_DEFAULT_NAME),
  THROTTLER_DEFAULT_TTL: Joi.number().default(DEFAULT_THROTTLER_DEFAULT_TTL),
  THROTTLER_DEFAULT_LIMIT: Joi.number().default(DEFAULT_THROTTLER_DEFAULT_LIMIT),

  THROTTLER_STRICT_NAME: Joi.string().default(DEFAULT_THROTTLER_STRICT_NAME),
  THROTTLER_STRICT_TTL: Joi.number().default(DEFAULT_THROTTLER_STRICT_TTL),
  THROTTLER_STRICT_LIMIT: Joi.number().default(DEFAULT_THROTTLER_STRICT_LIMIT),

  THROTTLER_LONG_NAME: Joi.string().default(DEFAULT_THROTTLER_LONG_NAME),
  THROTTLER_LONG_TTL: Joi.number().default(DEFAULT_THROTTLER_LONG_TTL),
  THROTTLER_LONG_LIMIT: Joi.number().default(DEFAULT_THROTTLER_LONG_LIMIT),
})

/** typeorm配置验证 */
export const TypeOrmValidationSchema = BaseValidationSchema.append<ITypeOrmValidationSchema>({
  ORM_TYPE: Joi.string().default(DEFAULT_ORM_TYPE),
  ORM_PORT: Joi.number().default(DEFAULT_ORM_PORT),
  ORM_HOST: Joi.string().default(DEFAULT_ORM_HOST),
  ORM_DATABASE: Joi.string().default(DEFAULT_ORM_DATABASE),
  ORM_USERNAME: Joi.string().default(DEFAULT_ORM_USERNAME),
  ORM_PASSWORD: Joi.string().default(DEFAULT_ORM_PASSWORD),
  ORM_POOL_SIZE: Joi.number().default(DEFAULT_ORM_POOL_SIZE),
  ORM_CONNECTOR_PACKAGE: Joi.string().default(DEFAULT_ORM_CONNECTOR_PACKAGE),
  ORM_TIMEZONE: Joi.string().default(DEFAULT_ORM_TIMEZONE),
  ORM_CHARSET: Joi.string().default(DEFAULT_ORM_CHARSET),
  ORM_SYNCHRONIZE: Joi.boolean().default(DEFAULT_ORM_SYNCHRONIZE),
  ORM_AUTO_LOAD_ENTITIES: Joi.boolean().default(DEFAULT_ORM_AUTO_LOAD_ENTITIES),
  ORM_LOGGING: Joi.boolean().default(DEFAULT_ORM_LOGGING),
  ORM_RETRY_ATTEMPTS: Joi.number().default(DEFAULT_ORM_RETRY_ATTEMPTS),
  ORM_RETRY_DELAY: Joi.number().default(DEFAULT_ORM_RETRY_DELAY),
})

/** 邮箱配置验证 */
export const EmailValidationSchema = BaseValidationSchema.append<IEmailValidationSchema>({
  EMAIL_HOST: Joi.string().default(DEFAULT_EMAIL_HOST),
  EMAIL_PORT: Joi.string().default(DEFAULT_EMAIL_PORT),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
  EMAIL_SECURE: Joi.boolean().default(DEFAULT_EMAIL_SECURE),
  EMAIL_TEMPLATE_DIR: Joi.string().default(DEFAULT_EMAIL_TEMPLATE_DIR),
})

/** winston配置验证 */
export const WinstonValidationSchema = BaseValidationSchema.append<IWinstonValidationSchema>({
  WINSTON_LEVEL: Joi.string()
    .valid(...LEVEL_TYPE)
    .default(DEFAULT_WINSTON_LEVEL),
  WINSTON_DIRNAME: Joi.string().default(DEFAULT_WINSTON_DIRNAME),
  WINSTON_FILENAME: Joi.string().default(DEFAULT_WINSTON_FILENAME),
  WINSTON_DATE_PATTERN: Joi.string().default(DEFAULT_WINSTON_DATE_PATTERN),
  WINSTON_MAX_SIZE: Joi.string().default(DEFAULT_WINSTON_MAX_SIZE),
  WINSTON_MAX_FILES: Joi.string().default(DEFAULT_WINSTON_MAX_FILES),
})
