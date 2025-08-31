/** app配置验证接口 */
export interface IAppValidationSchema {
  APP_NAME: string
  APP_PORT: number
  APP_HOSTNAME: string
  APP_GLOBAL_PREFIX: string
  APP_SALT: string
  APP_CORS_ORIGINS: string
  APP_CORS_METHODS: string
  APP_CORS_HEADERS: string
  APP_CORS_CREDENTIALS: boolean
  APP_CORS_MAX_AGE: number
}
