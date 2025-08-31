/** winston配置验证接口 */
/** 级别类型 */
export const LEVEL_TYPE = ['error', 'warn', 'info', 'http', 'verbose', 'debug', ''] as const
export interface IWinstonValidationSchema {
  /** 日志级别 */
  WINSTON_LEVEL: (typeof LEVEL_TYPE)[number]
  /** 日志目录名 */
  WINSTON_DIRNAME: string
  /** 日志文件名 */
  WINSTON_FILENAME: string
  /** 日期格式 */
  WINSTON_DATE_PATTERN: string
  /** 日志文件分片最大尺寸 */
  WINSTON_MAX_SIZE: string
  /** 日志文件保留天数或日志文件最大数量 */
  WINSTON_MAX_FILES: string
}
