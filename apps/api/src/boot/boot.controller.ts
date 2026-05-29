import type { IAppConfig, ISwaggerConfig } from '@/config'
import { Controller, Get, Param, Render } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiController, ApiMethod, IsNoFormat, IsPublic } from '@/common/deco'
import { CacheService } from '@/common/infra'
import { APP_CONFIG_KEY, SWAGGER_CONFIG_KEY } from '@/config'

@Controller()
@ApiController({ ApiTagsOptions: ['跳转swagger文档'] })
export class BootController {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  static readonly BOOT_START_TIME = 'BOOT_START_TIME'
  @IsPublic()
  @Get()
  @Render('page/index')
  @IsNoFormat()
  @ApiMethod({ ApiOperationOptions: [{ summary: '跳转swagger文档' }] })
  async boot() {
    const { name } = this.configService.get<IAppConfig>(APP_CONFIG_KEY)!
    const {
      enabled,
      config: { path },
    } = this.configService.get<ISwaggerConfig>(SWAGGER_CONFIG_KEY)!

    const startTime = (await this.cacheService.get(BootController.BOOT_START_TIME)) || '未知'
    return { name, enabled, path, startTime }
  }

  @Get('test')
  async test(@Param() a: any) {
    return a
  }
}
