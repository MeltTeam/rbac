import type { IRoleController } from './IRole'
import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { ApiController, ApiMethod } from '@/common/decorators/swagger.decorator'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { CreateRoleDTO } from './dto'
import { RoleService } from './role.service'
import { RoleVO } from './vo'

@Controller('system/role')
@ApiController({ ApiTagsOptions: ['系统管理-角色模块'] })
export class RoleController implements IRoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly clsService: ClsService<ILoggerCls>,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建角色' }],
    ApiResponseOptions: [{ type: RoleVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create(@Body() createRoleDTO: CreateRoleDTO) {
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    return await this.roleService.create(createRoleDTO, userInfo.id ?? SYSTEM_DEFAULT_BY)
  }
}
