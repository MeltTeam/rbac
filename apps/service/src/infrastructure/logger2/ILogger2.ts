import type { LoggerService } from '@nestjs/common'
import type { Response } from 'express'
import type { MongoClientOptions } from 'mongodb'
import type { ClsStore } from 'nestjs-cls'
import type DailyRotateFile from 'winston-daily-rotate-file'
import type { LOGGER_TYPES } from './logger2.constant'
import type { LEVEL_TYPE } from '@/configs/interfaces'
import type { UserInfo } from '@/modules/auth/vo'
/** 日志信息 */
export interface ILoggerInfo {
  /** 请求唯一ID */
  requestId: string
  /** 用户信息 */
  userInfo: UserInfo
  /** 客户端IP */
  clientIp: string
  /** 请求方法 */
  method: string
  /** 开始时间戳 */
  startTimestamp: number
  /** 结束时间戳 */
  endTimestamp: number
  /** 请求url */
  originUrl: string
  /** 来源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 状态码 */
  status: number
  /** 执行时间 */
  executionTime: string
  /** 日志类型 */
  type: (typeof LOGGER_TYPES)[keyof typeof LOGGER_TYPES][0] | null
  /** 信息 */
  msg: string
  /** 堆栈信息 */
  stack: string
}

export interface ILoggerCls extends ClsStore {
  /** 用户信息 */
  USER_INFO: UserInfo
  /** 客户端IP */
  CLIENT_IP: string
  /** 请求方法 */
  METHOD: string
  /** 开始时间戳 */
  START_TIMESTAMP: number
  /** 请求url */
  ORIGIN_URL: string
  /** 来源 */
  REFERER: string
  /** 客户端信息 */
  USER_AGENT: string
}

/** 传给日志任务队列的数据格式 */
export interface ILogger2JobData {
  /** 日志上下文 */
  context: string
  /** 日志内容 */
  message: string
  /** 日志级别 */
  level: (typeof LEVEL_TYPE)[number]
}

export interface IWinstonLogger extends LoggerService {
  /** 获取当前时间 */
  getTime: () => string
}

/** 初始化MongoDB参数 */
export interface IInitMongoDBOptions extends MongoClientOptions {
  /** 重连间隔 */
  reconnectInterval: number
}
export interface ILoggerService extends LoggerService {
  /** 初始化日志模式 */
  initMode: () => void

  /**
   * 创建winston文件日志配置
   * @param level 日志级别
   */
  createFileTransport: (level: (typeof LEVEL_TYPE)[number]) => DailyRotateFile

  /**
   * 添加winston文件日志配置
   * @param fileTransports 日志配置数组
   */
  addFileTransport: (fileTransports: DailyRotateFile[]) => Promise<void>

  /** 移除所有winston文件日志配置 */
  removeAllFileTransport: () => Promise<void>

  /**
   * 初始化mongoDB
   * @param url mongodb连接地址
   * @param options mongodb连接参数
   * @param reconnectInterval 重连间隔(默认:5000ms)
   */
  // initMongoDB: (url: string, options?: IInitMongoDBOptions, reconnectInterval?: number) => Promise<MongoClient>

  /**
   * 添加winston-mongodb日志配置
   * @param level 日志级别
   */
  // addMongoDBTransport: (level: (typeof LEVEL_TYPE)[number]) => Promise<void>

  /** 移除winston-mongodb日志配置 */
  // removeMongoDBTransport: () => Promise<void>

  /**
   * 获取日志信息
   * @param response http响应对象
   */
  getLoggerInfo: (response: Response) => ILoggerInfo

  /**
   * 记录日志动作
   * @param response http响应对象
   * @param exception 异常对象
   */
  action: (response: Response, exception?: any) => Promise<boolean>

  /**
   * 获取传给日志任务队列的数据格式
   * @param response http响应对象
   * @param exception 异常对象
   */
  getLogger2JobData: (exception?: unknown) => ILogger2JobData
}
