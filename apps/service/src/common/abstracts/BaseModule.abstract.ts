import type { OnModuleInit } from '@nestjs/common'
import { Logger } from '@nestjs/common'

export abstract class BaseModule implements OnModuleInit {
  logger: Logger
  protected _className?: string
  constructor(className?: string) {
    this._className = className
  }

  async onModuleInit() {
    this.logger = new Logger(this.constructor.name)
  }

  /** 获取当前类名 */
  get className() {
    return this._className ?? this.constructor.name
  }

  /**
   * 创建函数key
   * @param fnName 函数名
   */
  createFnKey(fnName: string) {
    return `${this.className}:${fnName}`
  }
}
