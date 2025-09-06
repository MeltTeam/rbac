import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TYPEORM_CONFIG_KEY } from '@/configs'
import { WinstonLogger } from '@/infrastructure/logger2/logger2.util'
import { createMysqlDatabase } from './database.util'

/** 数据库模块 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>(TYPEORM_CONFIG_KEY)!
        await createMysqlDatabase({
          config: config as MysqlConnectionOptions,
          loggerContext: DatabaseModule.name,
          logger: new WinstonLogger(),
        })
        return config
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
