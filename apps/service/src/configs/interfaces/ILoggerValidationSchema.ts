/** logger配置验证接口 */
/** 级别类型 */
export const LEVEL_TYPE = ['error', 'warn', 'info', 'http', 'verbose', 'debug'] as const
export interface ILoggerValidationSchema {
  /** 日志级别 */
  LOGGER_LEVEL: (typeof LEVEL_TYPE)[number]
  /** 日志目录名 */
  LOGGER_DIRNAME: string
  /** 日志文件名 */
  LOGGER_FILENAME: string
  /** 日期格式 */
  LOGGER_DATE_PATTERN: string
  /** 日志文件分片最大尺寸 */
  LOGGER_MAX_SIZE: string
  /** 日志文件保留天数或日志文件最大数量 */
  LOGGER_MAX_FILES: string
}
