import type { ILogger2JobData } from './ILogger2'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { HttpException, Inject } from '@nestjs/common'
import { Job } from 'bullmq'
import { BusinessException, SystemException } from '@/common/exceptions'
import { LOGGER_QUEUE_TOKEN } from '@/infrastructure/queues/queues.constant'
import { Logger2Service } from './logger2.service'

/** 日志队列处理 */
@Processor(LOGGER_QUEUE_TOKEN)
export class LoggerProcessor extends WorkerHost {
  @Inject(Logger2Service)
  logger2Service: Logger2Service

  constructor() {
    super()
  }

  /** 处理 */
  async process(job: Job) {
    const { loggerInfo, exception } = job.data as ILogger2JobData
    const context = `${loggerInfo.originUrl}` || LoggerProcessor.name
    switch (true) {
      case !exception: {
        this.logger2Service.log(JSON.stringify(loggerInfo), context)
        break
      }
      case exception instanceof BusinessException: {
        const res = exception.getResponse() as any
        this.logger2Service.warn(
          JSON.stringify({
            ...loggerInfo,
            type: '业务异常',
            msg: Array.isArray(res.message) ? res.message[0] : res.message,
          }),
          context,
        )
        break
      }

      case exception instanceof HttpException: {
        const res = exception.getResponse() as any
        this.logger2Service.warn(
          JSON.stringify({
            ...loggerInfo,
            type: '内置HTTP异常',
            msg: Array.isArray(res.message) ? res.message[0] : res.message,
          }),
          context,
        )
        break
      }
      case exception instanceof SystemException: {
        this.logger2Service.error(
          JSON.stringify({
            ...loggerInfo,
            type: '手动系统异常',
            msg: exception.message,
            stack: exception.stack,
          }),
          context,
        )
        break
      }
      case exception instanceof Error: {
        this.logger2Service.error(
          JSON.stringify({
            ...loggerInfo,
            type: '非手动系统异常',
            msg: exception.message,
            stack: exception.stack,
          }),
          context,
        )
        break
      }

      default: {
        this.logger2Service.error(
          JSON.stringify({
            ...loggerInfo,
            type: '未知异常',
            msg: exception.message,
            stack: exception.stack,
          }),
          context,
        )
      }
    }
  }
}
