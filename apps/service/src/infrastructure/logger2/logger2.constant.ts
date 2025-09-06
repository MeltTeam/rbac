import type { LoggerOptions } from 'winston'
import chalk from 'chalk'
import { format, transports } from 'winston'
import { APP_PID } from '@/common/constants'
import { WINSTON_CONFIG_KEY } from '@/configs'

/** 用于注入日志服务的key */
export const LOGGER2_SERVICE_TOKEN = Symbol(WINSTON_CONFIG_KEY)
// 定义日志级别颜色
export const levelsColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  verbose: 'blue',
  debug: 'magenta',
}
/** 默认配置 */
export const WINSTON_DEFAULT_CONFIG = {
  level: 'debug',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
  defaultMeta: { service: 'log-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({
          colors: levelsColors,
        }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => {
          const symbols = Object.getOwnPropertySymbols(info)[0]
          const level = info[symbols] as string
          // 获取日志级别的颜色
          const color = levelsColors[level]
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
} as LoggerOptions
