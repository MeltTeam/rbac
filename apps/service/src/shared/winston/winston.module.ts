import type { DynamicModule, Provider } from '@nestjs/common'
import type { LoggerOptions } from 'winston'
import { Global, Module } from '@nestjs/common'
import { WINSTON_SERVICE_TOKEN } from './winston.constant'
import { WinstonService } from './winston.service'

export interface IWinstonModuleOptions {
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
export class WinstonModule {
  public static async forRootAsync(options: IWinstonModuleOptions): Promise<DynamicModule> {
    const { inject, isGlobal, useFactory } = options
    const winstonProvider: Provider = {
      provide: WINSTON_SERVICE_TOKEN,
      useFactory: async (...args: any[]) => {
        const config = await useFactory(...args)
        return new WinstonService(config)
      },
      inject: inject || [],
    }

    return {
      global: isGlobal !== false,
      module: WinstonModule,
      providers: [winstonProvider],
      exports: [WINSTON_SERVICE_TOKEN],
    }
  }
}
