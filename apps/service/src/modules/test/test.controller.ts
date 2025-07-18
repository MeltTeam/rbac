import { Controller, Get } from '@nestjs/common'
import { TestService } from './test.service'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'

@Controller('test')
export class TestController extends BaseModule {
  constructor(private readonly testService: TestService) {
    super(TestController.name)
  }
  @Get()
  async test() {
    return this.testService.test()
  }
  @Get('set')
  async set() {
    return await this.testService.set()
  }
  @Get('get')
  async get() {
    const res = await this.testService.get()
    this.logger.debug(res)
    return res ?? false
  }

  @Get('del')
  async del() {
    return await this.testService.del()
  }

  @Get('update')
  async update() {
    return await this.testService.update()
  }

  @Get('delayedDel')
  async delayedDel() {
    return await this.testService.delayedDel()
  }
}
