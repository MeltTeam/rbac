import type { Logger, LoggerOptions } from 'winston'
import type { IWinstonLogger } from './ILogger2'
import dayjs from 'dayjs'
import { createLogger } from 'winston'
import { WINSTON_DEFAULT_CONFIG } from './logger2.constant'
/** winston日志记录器 */
export class WinstonLogger implements IWinstonLogger {
  private readonly _logger: Logger

  constructor(options?: LoggerOptions) {
    this._logger = createLogger(options || WINSTON_DEFAULT_CONFIG)
  }

  get logger() {
    return this._logger
  }

  getTime() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }

  log(message: string, context: string) {
    this.logger.info(message, { isLog: true, context, time: this.getTime() })
  }

  error(message: string, context: string) {
    this.logger.error(message, { context, time: this.getTime() })
  }

  warn(message: string, context: string) {
    this.logger.warn(message, { context, time: this.getTime() })
  }

  info(message: string, context: string) {
    this.logger.info(message, { context, time: this.getTime() })
  }

  http(message: string, context: string) {
    this.logger.http(message, { context, time: this.getTime() })
  }

  verbose(message: string, context: string) {
    this.logger.verbose(message, { context, time: this.getTime() })
  }

  debug(message: string, context: string) {
    this.logger.debug(message, { context, time: this.getTime() })
  }
}
