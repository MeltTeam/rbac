import type { Queue } from 'bullmq'
import type { Response } from 'express'
import type Redis from 'ioredis'
import type { ILogger2JobData, ILoggerInfo, ILoggerService } from './ILogger2'
import type { WinstonLogger } from './logger2.util'
import { InjectQueue } from '@nestjs/bullmq'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { ClsService } from 'nestjs-cls'
import { BusinessException, SystemException } from '@/common/exceptions'
import { LOGGER_QUEUE_TOKEN, QUEUE_REDIS_CLIENT_TOKEN } from '@/infrastructure/queues/queues.constant'
import { redisIsOk } from '@/infrastructure/redis/redis.utils'
import { LOGGER2_SERVICE_TOKEN, LOGGER_CLS, LOGGER_TYPES } from './logger2.constant'

@Injectable()
export class Logger2Service implements ILoggerService {
  constructor(
    @Inject(LOGGER2_SERVICE_TOKEN) private readonly _logger: WinstonLogger,
    @InjectQueue(LOGGER_QUEUE_TOKEN)
    private readonly loggerQueue: Queue,
    @Inject(QUEUE_REDIS_CLIENT_TOKEN) private readonly queueRedis: Redis,
    private readonly clsService: ClsService,
  ) {}

  log(message: string, context: string) {
    this.logger.log(message, context)
  }

  error(message: string, context: string) {
    this.logger.error(message, context)
  }

  warn(message: string, context: string) {
    this.logger.warn(message, context)
  }

  info(message: string, context: string) {
    this.logger.info(message, context)
  }

  http(message: string, context: string) {
    this.logger.http(message, context)
  }

  verbose(message: string, context: string) {
    this.logger.verbose(message, context)
  }

  debug(message: string, context: string) {
    this.logger.debug(message, context)
  }

  /** winston日志记录器实例 */
  get logger() {
    return this._logger
  }

  getLoggerInfo(response: Response): ILoggerInfo {
    const status = response.statusCode
    const requestId = this.clsService.getId()
    const clientIp = this.clsService.get(LOGGER_CLS.CLIENT_IP)
    const method = this.clsService.get(LOGGER_CLS.METHOD)
    const startTimestamp = this.clsService.get(LOGGER_CLS.START_TIMESTAMP)
    const endTimestamp = dayjs().valueOf()
    const originUrl = this.clsService.get(LOGGER_CLS.ORIGIN_URL)
    const referer = this.clsService.get(LOGGER_CLS.REFERER)
    const userAgent = this.clsService.get(LOGGER_CLS.USER_AGENT)
    const executionTime = `${dayjs(endTimestamp).diff(dayjs(startTimestamp), 'millisecond', true)}ms`
    return {
      requestId,
      clientIp,
      method,
      startTimestamp,
      endTimestamp,
      originUrl,
      referer,
      userAgent,
      status,
      executionTime,
    }
  }

  getLoggerType(exception?: unknown): (typeof LOGGER_TYPES)[keyof typeof LOGGER_TYPES] {
    if (!exception) return LOGGER_TYPES.NORMAL_REQUEST
    if (exception instanceof BusinessException) return LOGGER_TYPES.BUSINESS_ERROR
    if (exception instanceof HttpException) return LOGGER_TYPES.BUILTIN_HTTP_ERROR
    if (exception instanceof SystemException) return LOGGER_TYPES.MANUAL_SYSTEM_ERROR
    if (exception instanceof Error) return LOGGER_TYPES.AUTO_SYSTEM_ERROR
    return LOGGER_TYPES.UNKNOWN_ERROR
  }

  async action(response: Response, exception?: unknown) {
    try {
      const loggerInfo = this.getLoggerInfo(response)
      if (redisIsOk(this.queueRedis)) {
        const jobData = { loggerInfo, exception } as ILogger2JobData
        await this.loggerQueue.add('action', jobData, {
          /** 失败重试 */
          attempts: 3,
          /** 指数退避重试 */
          backoff: { type: 'exponential', delay: 1000 },
        })
      }
      return true
    } catch (error) {
      throw new SystemException({ error })
    }
  }
}
