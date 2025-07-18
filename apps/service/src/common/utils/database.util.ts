import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { Logger } from '@nestjs/common'
import { createConnection } from 'mysql2/promise'

const logger = new Logger('database.util')
/**
 * 创建mysql数据库
 * @param config 配置
 */
export async function createMysqlDatabase(config: MysqlConnectionOptions) {
  try {
    const { host, username: user, password, database } = config!
    const connection = await createConnection({
      host,
      user,
      password,
    })
    logger.log(`连接mysql成功`)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci`)
    logger.log(`创建数据库 ${database} 成功`)
    const [nowMsg] = await connection.query(`SELECT NOW()`)
    logger.log(`数据库时间:${nowMsg[0]['NOW()']}`)
    await connection.end()
    logger.log(`退出mysql连接...`)
  } catch (e) {
    logger.error(e)
  }
}
