import type { IBaseValidationSchema } from './IBaseValidationSchema'

export interface IQueueValidationSchema extends IBaseValidationSchema {
  QUEUE_HOST?: string
  QUEUE_PORT?: number
  QUEUE_USERNAME?: string
  QUEUE_PASSWORD?: string
  QUEUE_DB: number
}
