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
  /** 内置超级管理员名(用于判断不能删除内置用户) */
  superAdminName: string
  /** 内置管理员名(用于判断不能删除内置用户) */
  adminName: string
  /** 内置普通用户名(用于判断不能删除内置用户) */
  userName: string
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
    superAdminName: value.APP_SUPER_ADMIN_NAME,
    adminName: value.APP_ADMIN_NAME,
    userName: value.APP_USER_NAME,
  }
})
/** app配置类型 */
export type AppConfigType = ConfigType<typeof AppConfig>
