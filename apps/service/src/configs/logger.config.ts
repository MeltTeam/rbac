import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { LoggerValidationSchema } from './validationSchema'

/** logger配置key */
export const LOGGER_CONFIG_KEY = 'LOGGER_CONFIG_KEY'

/** logger配置接口 */
export interface ILoggerConfig {
  /** 日志级别 */
  level: string
  /** 日志目录名 */
  dirname: string
  /** 日志文件名 */
  filename: string
  /** 日期格式 */
  datePattern: string
  /** 日志文件分片最大尺寸 */
  maxSize: string
  /** 日志文件保留天数或日志文件最大数量 */
  maxFiles: string
}

/** logger配置 */
export const LoggerConfig = registerAs(LOGGER_CONFIG_KEY, (): ILoggerConfig => {
  const { error, value } = LoggerValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${LoggerConfig.name}:${error.message}`)
  return {
    level: value.LOGGER_LEVEL,
    dirname: value.LOGGER_DIRNAME,
    filename: value.LOGGER_FILENAME,
    datePattern: value.LOGGER_DATE_PATTERN,
    maxSize: value.LOGGER_MAX_SIZE,
    maxFiles: value.LOGGER_MAX_FILES,
  }
})
/** logger配置类型 */
export type LoggerConfigType = ConfigType<typeof LoggerConfig>
