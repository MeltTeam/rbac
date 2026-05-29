import type { IUserRoleController } from '../IUserRoleController'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { ResVO } from '@/common/vo'
import { RoleIdDTO, RoleIdsVO } from '@/modules/rbac/role/app'
import {
  GetRoleByUserQuery,
  GetUserByRoleQuery,
  ReplaceUserRoleCommand,
  ReplaceUserRoleDTO,
  ReplaceUsersRoleCommand,
  ReplaceUsersRoleDTO,
  UserIdDTO,
  UserIdsVO,
} from '../../../app'

/** 用户角色控制器实现 */
@Controller('user-role')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('USER_ROLE')
@ApiController({ ApiTagsOptions: ['UserRole'] })
@ApiExtraModels(RoleIdsVO, UserIdsVO)
export class UserRoleController implements IUserRoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('replace')
  @ResourceMethod('replace')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'replaceUserRole', summary: '替换用户的角色(全量替换)' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async replace(@Body() replaceUserRoleDTO: ReplaceUserRoleDTO) {
    return await this.commandBus.execute(new ReplaceUserRoleCommand(replaceUserRoleDTO))
  }

  @Post('batch-replace')
  @ResourceMethod('batchReplace')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'replaceUsersRole', summary: '批量替换用户的角色(全量替换)' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async batchReplace(@Body() replaceUsersRoleDTO: ReplaceUsersRoleDTO) {
    return await this.commandBus.execute(new ReplaceUsersRoleCommand(replaceUsersRoleDTO))
  }

  @Get('role-ids/:id')
  @ResourceMethod('roleIds')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getRoleByUser', summary: '获取用户的角色ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async roleIds(@Param() userIdDTO: UserIdDTO) {
    return this.queryBus.execute(new GetRoleByUserQuery(userIdDTO.id))
  }

  @Get('user-ids/:id')
  @ResourceMethod('userIds')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getUserByRole', summary: '获取角色的用户ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(UserIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async userIds(@Param() roleIdDTO: RoleIdDTO) {
    return this.queryBus.execute(new GetUserByRoleQuery(roleIdDTO.id))
  }
}
