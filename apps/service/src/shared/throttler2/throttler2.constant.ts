import { THROTTLER_CONFIG_KEY } from '@/configs'

/** 用于注入redis实例的key */
export const THROTTLER2_REDIS_CLIENT_TOKEN = Symbol(THROTTLER_CONFIG_KEY)
