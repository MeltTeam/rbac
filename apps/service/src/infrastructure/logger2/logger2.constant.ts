import type { LoggerOptions } from 'winston'
import chalk from 'chalk'
import { format, transports } from 'winston'
import { APP_PID } from '@/common/constants'
import { LOGGER_CONFIG_KEY } from '@/configs'

/** 用于注入日志服务的key */
export const LOGGER2_SERVICE_TOKEN = Symbol(LOGGER_CONFIG_KEY)
/** 定义日志级别颜色 */
export const LEVELS_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  verbose: 'blue',
  debug: 'magenta',
} as const
/** 日志类型 */
export const LOGGER_TYPES = {
  /** 正常请求 */
  NORMAL_REQUEST: '正常请求',
  /** 业务异常 */
  BUSINESS_ERROR: '业务异常',
  /** 内置HTTP异常 */
  BUILTIN_HTTP_ERROR: '内置HTTP异常',
  /** 手动系统异常 */
  MANUAL_SYSTEM_ERROR: '手动系统异常',
  /** 非手动系统异常 */
  AUTO_SYSTEM_ERROR: '非手动系统异常',
  /** 未知异常 */
  UNKNOWN_ERROR: '未知异常',
} as const
/** 日志上下文 */
export const LOGGER_CLS = {
  /** 客户端IP */
  CLIENT_IP: 'CLIENT_IP',
  /** 请求方法 */
  METHOD: 'METHOD',
  /** 开始时间戳 */
  START_TIMESTAMP: 'START_TIMESTAMP',
  /** 请求url */
  ORIGIN_URL: 'ORIGIN_URL',
  /** 来源 */
  REFERER: 'REFERER',
  /** 客户端信息 */
  USER_AGENT: 'USER_AGENT',
} as const
/** 默认配置 */
export const WINSTON_DEFAULT_CONFIG: LoggerOptions = {
  level: 'debug',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
  defaultMeta: { service: 'logs-service' },
  transports: [
    // 类似nest控制台日志
    new transports.Console({
      format: format.combine(
        format.colorize({
          colors: LEVELS_COLORS,
        }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => {
          const symbols = Object.getOwnPropertySymbols(info)[0]
          const level = info[symbols] as string
          // 获取日志级别的颜色
          const color = LEVELS_COLORS[level]
          const chalkColor = chalk[color]
          const appStr = chalkColor(`[NEST]`)
          const pidStr = chalkColor(`${APP_PID}  -|`)
          const contextStr = chalk.yellow(`[${info.context}]`)
          const messageStr = chalkColor(`${info.message}`)
          const levelStr = chalkColor(`${(info.isLog ? 'LOG' : level.toUpperCase()).padStart(8, ' ')}`)
          return `${appStr} ${pidStr} ${info.time}${levelStr} ${contextStr} ${messageStr} `
        }),
      ),
    }),
  ],
  exitOnError: false,
}
