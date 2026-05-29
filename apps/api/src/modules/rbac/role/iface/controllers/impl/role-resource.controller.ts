import type { IRoleResourceController } from '../IRoleResourceController'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { ResVO } from '@/common/vo'
import { ResourceIdDTO, ResourceIdsVO } from '@/modules/rbac/resource/app'
import {
  GetResourceByRoleQuery,
  GetRoleByResourceQuery,
  ReplaceRoleResourceCommand,
  ReplaceRoleResourceDTO,
  ReplaceRolesResourceCommand,
  ReplaceRolesResourceDTO,
  RoleIdDTO,
  RoleIdsVO,
} from '../../../app'

/** 角色资源控制器实现 */
@Controller('role-resource')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('ROLE_RESOURCE')
@ApiController({ ApiTagsOptions: ['RoleResource'] })
@ApiExtraModels(ResourceIdsVO, RoleIdsVO)
export class RoleResourceController implements IRoleResourceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('replace')
  @ResourceMethod('replace')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'replaceRoleResource', summary: '替换角色的资源(全量替换)' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async replace(@Body() replaceRoleResourceDTO: ReplaceRoleResourceDTO) {
    return await this.commandBus.execute(new ReplaceRoleResourceCommand(replaceRoleResourceDTO))
  }

  @Post('batch-replace')
  @ResourceMethod('batchReplace')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'replaceRolesResource', summary: '批量替换角色的资源(全量替换)' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async batchReplace(@Body() replaceRolesResourceDTO: ReplaceRolesResourceDTO) {
    return await this.commandBus.execute(new ReplaceRolesResourceCommand(replaceRolesResourceDTO))
  }

  @Get('resource-ids/:id')
  @ResourceMethod('resourceIds')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getResourceByRole', summary: '获取角色的资源ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(ResourceIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async resourceIds(@Param() roleIdDTO: RoleIdDTO) {
    return this.queryBus.execute(new GetResourceByRoleQuery(roleIdDTO.id))
  }

  @Get('role-ids/:id')
  @ResourceMethod('roleIds')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getRoleByResource', summary: '获取资源的角色ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async roleIds(@Param() resourceIdDTO: ResourceIdDTO) {
    return this.queryBus.execute(new GetRoleByResourceQuery(resourceIdDTO.id))
  }
}
