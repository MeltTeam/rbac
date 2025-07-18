import type { ConfigType } from '@nestjs/config'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { RedisOptions } from 'ioredis'
import { registerAs } from '@nestjs/config'
import { JwtValidationSchema } from './validationSchema'

/** jwt配置key */
export const JWT_CONFIG_KEY = 'JWT_CONFIG_KEY'
/** jwt配置接口 */
export interface IJwtConfig {
  /** 服务配置 */
  serviceConfig: JwtModuleOptions
  /** 短token过期时间 */
  accessTokenExpiresIn: string
  /** 长token过期时间 */
  refreshTokenExpiresIn: string
  /** cookie短token过期时间 */
  accessTokenCookieExpiresIn: number
  /** cookie长token过期时间 */
  refreshTokenCookieExpiresIn: number
  connectConfig: RedisOptions
}
/** jwt配置 */
export const JwtConfig = registerAs(JWT_CONFIG_KEY, (): IJwtConfig => {
  const { error, value } = JwtValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${JwtConfig.name}:${error.message}`)
  return {
    serviceConfig: {
      secret: value.JWT_SECRET,
      signOptions: {
        expiresIn: value.JWT_EXPIRES_IN,
      },
    },
    connectConfig: {
      host: value.JWT_REDIS_HOST ?? value.REDIS_HOST,
      port: value.JWT_REDIS_PORT ?? value.REDIS_PORT,
      username: value.JWT_REDIS_USERNAME ?? value.REDIS_USERNAME,
      password: value.JWT_REDIS_PASSWORD ?? value.REDIS_PASSWORD,
      db: value.JWT_REDIS_DB,
    },
    accessTokenExpiresIn: value.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: value.JWT_REFRESH_TOKEN_EXPIRES_IN,
    accessTokenCookieExpiresIn: value.JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN,
    refreshTokenCookieExpiresIn: value.JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  }
})

/** jwt配置类型 */
export type JwtConfigType = ConfigType<typeof JwtConfig>
