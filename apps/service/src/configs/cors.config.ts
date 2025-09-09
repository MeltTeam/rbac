import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { CorsValidationSchema } from './validationSchema'

/** cors配置key */
export const CORS_CONFIG_KEY = 'CORS_CONFIG_KEY'

/** cors配置接口 */
export interface ICorsConfig {
  /** 允许跨域的源(,隔开) */
  origins: string
  /** 允许跨域的请求方法类型 */
  methods: string
  /** 允许跨域的请求头属性 */
  allowedHeaders: string
  /** 允许跨域携带凭证 */
  credentials: boolean
  /** OPTIONS请求预检结果缓存的时间 */
  maxAge: number
}

/** cors配置 */
export const CorsConfig = registerAs(CORS_CONFIG_KEY, (): ICorsConfig => {
  const { error, value } = CorsValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${CorsConfig.name}:${error.message}`)
  return {
    origins: value.CORS_ORIGINS,
    methods: value.CORS_METHODS,
    allowedHeaders: value.CORS_ALLOWED_HEADERS,
    credentials: value.CORS_CREDENTIALS,
    maxAge: value.CORS_MAX_AGE,
  }
})
/** cors配置类型 */
export type CorsConfigType = ConfigType<typeof CorsConfig>
