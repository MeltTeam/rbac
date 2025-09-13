import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import type { WinstonLogger } from '@/infrastructure/logger2/logger2.util'
import { createPool } from 'mysql2/promise'

/** 创建mysql数据库配置 */
export interface ICreateMysqlDatabaseOptions {
  /** mysql配置 */
  config: MysqlConnectionOptions
  /** 日志服务 */
  logger: WinstonLogger
  /** 日志上下文 */
  loggerContext: string
}
/**
 * 创建mysql数据库
 * @param options 创建mysql数据库配置
 */
export async function createMysqlDatabase(options: ICreateMysqlDatabaseOptions) {
  const { config, logger, loggerContext } = options
  try {
    const { host, username: user, password, database } = config!
    const pool = createPool({
      host,
      user,
      password,
    })
    pool.on('connection', (connection) => {
      logger.log(`${connection.threadId} 新建连接`, loggerContext)
      connection.on('error', (error) => logger.error(`${connection.threadId} 错误: ${error.message}`, loggerContext))
      connection.on('connect', () => logger.log(`${connection.threadId} 连接成功`, loggerContext))
      connection.on('end', () => logger.log(`${connection.threadId} 连接已关闭`, loggerContext))
    })
    pool.on('acquire', (connection) => logger.log(`${connection.threadId} 获取连接成功`, loggerContext))
    pool.on('enqueue', () => logger.log(`连接中...`, loggerContext))
    pool.on('release', async (connection) => {
      logger.log(` ${connection.threadId} 手动释放连接中`, loggerContext)
      connection.destroy()
    })
    const connection = await pool.getConnection()
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci`)
    logger.log(`创建数据库 ${database} 成功`, loggerContext)
    const [nowMsg] = await connection.query(`SELECT NOW()`)
    logger.log(`数据库时间:${nowMsg[0]['NOW()']}`, loggerContext)
    connection.release()
  } catch (e) {
    logger.error(e, loggerContext)
  }
}
