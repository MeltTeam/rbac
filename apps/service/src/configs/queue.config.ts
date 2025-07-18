import type { ConfigType } from '@nestjs/config'
import type { QueueOptions } from 'bullmq'
import { registerAs } from '@nestjs/config'
import { QueueValidationSchema } from './validationSchema'

/** 队列配置key */
export const QUEUE_CONFIG_KEY = 'QUEUE_CONFIG_KEY'

/** 队列配置 */
export const QueueConfig = registerAs(QUEUE_CONFIG_KEY, (): QueueOptions => {
  const { error, value } = QueueValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${QueueConfig.name}:${error.message}`)
  return {
    connection: {
      host: value.QUEUE_HOST ?? value.REDIS_HOST,
      port: value.QUEUE_PORT ?? value.REDIS_PORT,
      username: value.QUEUE_USERNAME ?? value.REDIS_USERNAME,
      password: value.QUEUE_PASSWORD ?? value.REDIS_PASSWORD,
      db: value.QUEUE_DB,
    },
  }
})

/** 队列配置类型 */
export type QueueConfigType = ConfigType<typeof QueueConfig>
