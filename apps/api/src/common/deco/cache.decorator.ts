import { SetMetadata } from '@nestjs/common'

/** 忽略缓存KEY */
export const SKIP_CACHE_KEY = Symbol('SKIP_CACHE_KEY')
/** 忽略缓存(用于不用缓存的接口) */
export function SkipCache() {
  return SetMetadata(SKIP_CACHE_KEY, true)
}
