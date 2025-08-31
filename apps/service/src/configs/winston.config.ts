import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { WinstonValidationSchema } from './validationSchema'

/** winston配置key */
export const WINSTON_CONFIG_KEY = 'WINSTON_CONFIG_KEY'

/** winston配置接口 */
export interface IWinstonConfig {
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

/** winston配置 */
export const WinstonConfig = registerAs(WINSTON_CONFIG_KEY, (): IWinstonConfig => {
  const { error, value } = WinstonValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${WinstonConfig.name}:${error.message}`)
  return {
    level: value.WINSTON_LEVEL,
    dirname: value.WINSTON_DIRNAME,
    filename: value.WINSTON_FILENAME,
    datePattern: value.WINSTON_DATE_PATTERN,
    maxSize: value.WINSTON_MAX_SIZE,
    maxFiles: value.WINSTON_MAX_FILES,
  }
})
/** winston配置类型 */
export type WinstonConfigType = ConfigType<typeof WinstonConfig>
