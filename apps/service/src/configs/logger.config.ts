import type { ConfigType } from '@nestjs/config'
import type { LOGGER_MODE } from './interfaces'
import { registerAs } from '@nestjs/config'
import { LoggerValidationSchema } from './validationSchema'

/** logger配置key */
export const LOGGER_CONFIG_KEY = 'LOGGER_CONFIG_KEY'

/** logger配置接口 */
export interface ILoggerConfig {
  /** 日志级别 */
  level: string
  /** 日志模式 */
  mode: (typeof LOGGER_MODE)[number]
  /** 文件日志配置 */
  fileConfig: {
    /** 日志目录名 */
    dirname: string
    /** 日志文件名 */
    filename: string
    /** 日期格式 */
    datePattern: string
    /** 是否压缩归档 */
    zippedArchive: boolean
    /** 日志文件分片最大尺寸 */
    maxSize: string
    /** 日志文件保留天数或日志文件最大数量 */
    maxFiles: string
  }
  /** mongodb配置 */
  mongodbConfig: any
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
    mode: value.LOGGER_MODE,
    fileConfig: {
      dirname: value.LOGGER_FILE_DIRNAME,
      filename: value.LOGGER_FILE_FILENAME,
      datePattern: value.LOGGER_FILE_DATE_PATTERN,
      zippedArchive: value.LOGGER_FILE_ZIPPED_ARCHIVE,
      maxSize: value.LOGGER_FILE_MAX_SIZE,
      maxFiles: value.LOGGER_FILE_MAX_FILES,
    },
    mongodbConfig: {},
  }
})
/** logger配置类型 */
export type LoggerConfigType = ConfigType<typeof LoggerConfig>
