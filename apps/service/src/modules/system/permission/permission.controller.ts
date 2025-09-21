import type { IPermissionController } from './IPermission'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators/swagger.decorator'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { PermissionService } from './permission.service'
import { PermissionVO } from './vo'

@Controller('permission')
@ApiController({ ApiTagsOptions: ['权限模块'] })
export class PermissionController implements IPermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @UseGuards(JwtGuard)
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建权限' }],
    ApiResponseOptions: [{ type: PermissionVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create() {
    return await this.permissionService.create()
  }
}
