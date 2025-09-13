/** 级别类型 */
export const LEVEL_TYPE = ['error', 'warn', 'info', 'http', 'verbose', 'debug'] as const
/** 日志模式(none:关闭日志持久化 file:file日志，mongodb:mongodb日志,会自动降级(优先mongodb日志，下线则降级为file日志)) */
export const LOGGER_MODE = ['none', 'file', 'mongodb'] as const
/** logger配置验证接口 */
export interface ILoggerValidationSchema {
  LOGGER_MODE: (typeof LOGGER_MODE)[number]
  LOGGER_LEVEL: (typeof LEVEL_TYPE)[number]
  LOGGER_FILE_DIRNAME: string
  LOGGER_FILE_FILENAME: string
  LOGGER_FILE_DATE_PATTERN: string
  LOGGER_FILE_ZIPPED_ARCHIVE: boolean
  LOGGER_FILE_MAX_SIZE: string
  LOGGER_FILE_MAX_FILES: string
  LOGGER_MONGODB: string
}
