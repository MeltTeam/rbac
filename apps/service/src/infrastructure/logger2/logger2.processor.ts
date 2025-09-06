import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { Job } from 'bullmq'
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
    this.logger2Service.debug(JSON.stringify(job.data), LoggerProcessor.name)
    // const { originUrl } = loggerInfo
    // const context = `${originUrl}` || 'Unknown'
    // switch (true) {
    //   case !exception: {
    //     this.log(JSON.stringify(loggerInfo), context)
    //     break
    //   }
    //   case exception instanceof BusinessException: {
    //     const res = exception.getResponse() as any
    //     this.warn(
    //       JSON.stringify({
    //         ...loggerInfo,
    //         type: '业务异常',
    //         msg: Array.isArray(res.message) ? res.message[0] : res.message,
    //       }),
    //       context,
    //     )
    //     break
    //   }

    //   case exception instanceof HttpException: {
    //     const res = exception.getResponse() as any
    //     this.warn(
    //       JSON.stringify({
    //         ...loggerInfo,
    //         type: '内置HTTP异常',
    //         msg: Array.isArray(res.message) ? res.message[0] : res.message,
    //       }),
    //       context,
    //     )
    //     break
    //   }
    //   case exception instanceof SystemException: {
    //     this.error(
    //       JSON.stringify({
    //         ...loggerInfo,
    //         type: '手动系统异常',
    //         msg: exception.message,
    //         stack: exception.stack,
    //       }),
    //       context,
    //     )
    //     break
    //   }
    //   case exception instanceof Error: {
    //     this.error(
    //       JSON.stringify({
    //         ...loggerInfo,
    //         type: '非手动系统异常',
    //         msg: exception.message,
    //         stack: exception.stack,
    //       }),
    //       context,
    //     )
    //     break
    //   }

    //   default: {
    //     this.error(
    //       JSON.stringify({
    //         ...loggerInfo,
    //         type: '未知异常',
    //         msg: exception.message,
    //         stack: exception.stack,
    //       }),
    //       context,
    //     )
    //   }
    // }
  }
}
