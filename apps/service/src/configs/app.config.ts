import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { AppValidationSchema } from './validationSchema'

/** app配置key */
export const APP_CONFIG_KEY = 'APP_CONFIG_KEY'

/** app配置接口 */
export interface IAppConfig {
  /** app名称 */
  name: string
  /** app端口 */
  port: number
  /** 主机名 */
  hostname: string
  /** app全局访问前缀 */
  globalPrefix: string
  /** app盐 */
  salt: string
  /** 跨域处理 */
  cors: {
    /** 允许跨域的源(,隔开) */
    origins: string
    /** 允许跨域的请求方法类型 */
    methods: string
    /** 允许跨域的请求头属性 */
    headers: string
    /** 允许跨域携带凭证 */
    credentials: boolean
    /** OPTIONS请求预检结果缓存的时间 */
    maxAge: number
  }
  // csrf防御
  // csrf: {
  //   /** 密钥 */
  //   secret: string
  // }
}

/** app配置 */
export const AppConfig = registerAs(APP_CONFIG_KEY, (): IAppConfig => {
  const { error, value } = AppValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${AppConfig.name}:${error.message}`)
  return {
    name: value.APP_NAME,
    port: value.APP_PORT,
    hostname: value.APP_HOSTNAME,
    globalPrefix: value.APP_GLOBAL_PREFIX,
    salt: value.APP_SALT,
    cors: {
      origins: value.APP_CORS_ORIGINS,
      methods: value.APP_CORS_METHODS,
      headers: value.APP_CORS_HEADERS,
      credentials: value.APP_CORS_CREDENTIALS,
      maxAge: value.APP_CORS_MAX_AGE,
    },
  }
})
/** app配置类型 */
export type AppConfigType = ConfigType<typeof AppConfig>
