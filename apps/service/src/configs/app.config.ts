import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { AppValidationSchema } from './validationSchema'

/** app配置key */
export const APP_CONFIG_KEY = 'APP_CONFIG_KEY'

/** app配置接口 */
export interface AppConfigInterface {
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
}

/** app配置 */
export const AppConfig = registerAs(APP_CONFIG_KEY, (): AppConfigInterface => {
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
  }
})
/** app配置类型 */
export type AppConfigType = ConfigType<typeof AppConfig>
