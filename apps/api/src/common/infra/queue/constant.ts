/** 用于注入redis实例的key */
export const QUEUE_REDIS_CLIENT_TOKEN = Symbol('QUEUE_REDIS_CLIENT_TOKEN')
/** 注册的缓存队列名(提供给其他模块获取队列实例) */
export const CACHE_QUEUE_TOKEN = 'cache'
/** 缓存队列容量(完成) */
export const CACHE_QUEUE_COMPLETE = 500
/** 缓存队列容量(失败) */
export const CACHE_QUEUE_FAIL = 500
/** 注册的邮箱队列名(提供给其他模块获取队列实例) */
export const EMAIL_QUEUE_TOKEN = 'email'
/** 邮箱队列容量(完成) */
export const EMAIL_QUEUE_COMPLETE = 500
/** 邮箱队列容量(失败) */
export const EMAIL_QUEUE_FAIL = 500
/** 注册的日志队列名(提供给其他模块获取队列实例) */
export const LOGGING_QUEUE_TOKEN = 'logging'
/** 日志队列容量(完成) */
export const LOGGING_QUEUE_COMPLETE = 500
/** 日志队列容量(失败) */
export const LOGGING_QUEUE_FAIL = 500
