import type { DynamicModule, Provider } from '@nestjs/common'
import type { LoggerOptions } from 'winston'
import { Global, Module } from '@nestjs/common'
// import { MongooseModule } from '@nestjs/mongoose'
import { LOGGER2_SERVICE_TOKEN } from './logger2.constant'
import { LoggerProcessor } from './logger2.processor'
import { Logger2Service } from './logger2.service'
import { WinstonLogger } from './logger2.util'

export interface ILogger2ModuleOptions {
  /** 返回winston的配置 */
  useFactory: (...args: any[]) => Promise<LoggerOptions>
  /** 是否为全局模块 */
  isGlobal?: boolean
  /** 注入useFactory的服务 */
  inject?: any[]
}

/** 日志模块 */
@Global()
@Module({})
export class Logger2Module {
  public static async forRootAsync(options: ILogger2ModuleOptions): Promise<DynamicModule> {
    const { inject, isGlobal, useFactory } = options
    let config
    // 提供日志实例
    const Logger2Provider: Provider = {
      provide: LOGGER2_SERVICE_TOKEN,
      useFactory: async (...args: any[]) => {
        config = await useFactory(...args)
        return new WinstonLogger(config)
      },
      inject: inject || [],
    }
    // mongodb模块(用于获取日志数据库实例,便于监听日志数据库的状态)
    // const MongooseModuleImport = MongooseModule.forRootAsync({
    //   useFactory: async () => {
    //     return config
    //   },
    //   inject: inject || [],
    // })

    return {
      global: isGlobal,
      module: Logger2Module,
      // imports: [MongooseModuleImport],
      providers: [Logger2Provider, Logger2Service, LoggerProcessor],
      exports: [LOGGER2_SERVICE_TOKEN, Logger2Service, LoggerProcessor],
    }
  }
}
