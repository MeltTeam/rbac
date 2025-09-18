import { JWT_CONFIG_KEY } from '@/configs'

export const JWT_REDIS_CLIENT_TOKEN = Symbol(JWT_CONFIG_KEY)

/** token类型 */
export const TokenType = {
  /** 刷新token */
  REFRESH_TOKEN: 'refreshToken',
  /** 访问token */
  ACCESS_TOKEN: 'accessToken',
} as const
