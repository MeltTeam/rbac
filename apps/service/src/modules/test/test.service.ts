import { Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache/cache.service'

@Injectable()
export class TestService {
  constructor(private readonly cacheService: CacheService) {}
  async test() {
    return 'test'
  }

  async set() {
    return await this.cacheService.set('test', '111111111111111111', 3 * 60 * 1000)
  }

  async get() {
    return await this.cacheService.get('test')
  }

  async del() {
    return await this.cacheService.del('test')
  }

  async update() {
    return await this.cacheService.update('test', '222222222222222222')
  }

  async delayedDel() {
    return await this.cacheService.delayedDel('test', 10 * 1000)
  }
}
