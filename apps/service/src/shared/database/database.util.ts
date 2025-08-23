import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { Logger } from '@nestjs/common'
import { createPool } from 'mysql2/promise'

const logger = new Logger('database.util')
/**
 * 创建mysql数据库
 * @param config 配置
 */
export async function createMysqlDatabase(config: MysqlConnectionOptions) {
  try {
    const { host, username: user, password, database } = config!
    const pool = createPool({
      host,
      user,
      password,
    })
    pool.on('connection', (connection) => {
      logger.log(`${connection.threadId} 新建连接`)
      connection.on('error', (error) => logger.error(`${connection.threadId} 错误: ${error.message}`))
      connection.on('connect', () => logger.log(`${connection.threadId} 连接成功`))
      connection.on('end', () => logger.warn(`${connection.threadId} 连接已关闭`))
    })
    pool.on('acquire', (connection) => logger.log(`${connection.threadId} 获取连接成功`))
    pool.on('enqueue', () => logger.warn(`连接中...`))
    pool.on('release', async (connection) => {
      logger.warn(` ${connection.threadId} 手动释放连接中`)
      connection.destroy()
    })
    const connection = await pool.getConnection()
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci`)
    logger.log(`创建数据库 ${database} 成功`)
    const [nowMsg] = await connection.query(`SELECT NOW()`)
    logger.log(`数据库时间:${nowMsg[0]['NOW()']}`)
    connection.release()
  } catch (e) {
    logger.error(e)
  }
}
