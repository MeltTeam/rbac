import type { ConfigType } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import type { DataSourceOptions } from 'typeorm'
import { registerAs } from '@nestjs/config'
import { DataSource } from 'typeorm'
import { DEFAULT_ORM_EXTRA } from './constants'
import { TypeOrmValidationSchema } from './validationSchema'

/** 基础数据源配置 */
export function baseDataSourceOptions(): DataSourceOptions {
  const { error, value } = TypeOrmValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${baseDataSourceOptions.name}:${error.message}`)
  return {
    type: value.ORM_TYPE as unknown as 'mysql',
    port: value.ORM_PORT,
    host: value.ORM_HOST,
    database: value.ORM_DATABASE,
    username: value.ORM_USERNAME,
    password: value.ORM_PASSWORD,
    poolSize: value.ORM_POOL_SIZE,
    connectorPackage: value.ORM_CONNECTOR_PACKAGE as unknown as 'mysql2',
    /** 处理执行多条语句报错（默认是只允许执行一条语句） */
    multipleStatements: process.env.npm_lifecycle_event === 'typeorm',
    /** 数据库时区 */
    timezone: value.ORM_TIMEZONE,
    charset: value.ORM_CHARSET,
    extra: DEFAULT_ORM_EXTRA,
  }
}

/** mysql配置key */
export const TYPEORM_CONFIG_KEY = 'TYPEORM_CONFIG_KEY'
/** mysql配置 */
export const TypeOrmConfig = registerAs(TYPEORM_CONFIG_KEY, (): TypeOrmModuleOptions => {
  const { error, value } = TypeOrmValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${TypeOrmConfig.name}:${error.message}`)
  return {
    /** 是否同步数据库（默认：false） */
    synchronize: value.ORM_SYNCHRONIZE,
    /** 自动加载实体（默认：true） */
    autoLoadEntities: value.ORM_AUTO_LOAD_ENTITIES,
    /** 是否打印日志（默认：false） */
    logging: value.ORM_LOGGING,
    retryAttempts: 2,
    retryDelay: 1000,
    ...baseDataSourceOptions(),
  }
})

/** mysql配置类型 */
export type TypeOrmConfigType = ConfigType<typeof TypeOrmConfig>

/** 数据迁移数据源 */
export const baseDataSource = new DataSource({
  ...baseDataSourceOptions(),
})
