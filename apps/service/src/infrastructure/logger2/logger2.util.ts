import type { Logform } from 'winston'
import type { IWinstonLogger } from './ILogger2'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston'
import { APP_PID } from '@/common/constants'

/**
 * 类似nest控制台日志
 * @param consoleName 名称，默认NEST
 */
export function likeNestConsole(consoleName: string = 'NEST'): transports.ConsoleTransportInstance {
  /** 定义日志级别颜色 */
  const LEVELS_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    verbose: 'cyan',
    debug: 'magenta',
  } as const
  return new transports.Console({
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
        const appStr = chalkColor(`[${consoleName}]`)
        const pidStr = chalkColor(`${info.pid}  -|`)
        const contextStr = chalk.yellow(`[${info.context}]`)
        const messageStr = chalkColor(`${info.message}`)
        const levelStr = chalkColor(`${(info.isLog ? 'LOG' : level.toUpperCase()).padStart(8, ' ')}`)
        return `${appStr} ${pidStr} ${info.time}${levelStr} ${contextStr} ${messageStr} `
      }),
    ),
  })
}

/** 创建winston日志格式 */
export function createTransportFormat(): Logform.Format {
  return format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json())
}
/** winston日志记录器 */
export class WinstonLogger implements IWinstonLogger {
  private readonly _logger: Logger

  constructor(options?: LoggerOptions) {
    this._logger = createLogger(
      options || {
        level: 'debug',
        format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
        defaultMeta: { service: 'logs-service' },
        transports: [likeNestConsole()],
        exitOnError: false,
      },
    )
  }

  get logger() {
    return this._logger
  }

  getTime() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }

  log(message: string, context: string) {
    this.logger.verbose(message, { isLog: true, context, time: this.getTime(), pid: APP_PID })
  }

  error(message: string, context: string) {
    this.logger.error(message, { context, time: this.getTime(), pid: APP_PID })
  }

  warn(message: string, context: string) {
    this.logger.warn(message, { context, time: this.getTime(), pid: APP_PID })
  }

  info(message: string, context: string) {
    this.logger.info(message, { context, time: this.getTime(), pid: APP_PID })
  }

  http(message: string, context: string) {
    this.logger.http(message, { context, time: this.getTime(), pid: APP_PID })
  }

  verbose(message: string, context: string) {
    this.logger.verbose(message, { context, time: this.getTime(), pid: APP_PID })
  }

  debug(message: string, context: string) {
    this.logger.debug(message, { context, time: this.getTime(), pid: APP_PID })
  }
}
