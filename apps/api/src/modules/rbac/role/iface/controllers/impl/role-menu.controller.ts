import type { IRoleMenuController } from '../IRoleMenuController'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, IsPublic, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { ResVO } from '@/common/vo'
import { MenuIdDTO, MenuIdsVO } from '@/modules/rbac/menu/app'
import {
  GetMenuByRoleQuery,
  GetRoleByMenuQuery,
  ReplaceRoleMenuCommand,
  ReplaceRoleMenuDTO,
  ReplaceRolesMenuCommand,
  ReplaceRolesMenuDTO,
  RoleIdDTO,
  RoleIdsVO,
} from '../../../app'

/** 角色菜单控制器实现 */
@Controller('role-menu')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('ROLE_MENU')
@ApiController({ ApiTagsOptions: ['RoleMenu'] })
@IsPublic()
@ApiExtraModels(MenuIdsVO, RoleIdsVO)
export class RoleMenuController implements IRoleMenuController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('replace')
  @ResourceMethod('replace')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'replaceRoleMenu', summary: '替换角色的菜单(全量替换)' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async replace(@Body() replaceRoleMenuDTO: ReplaceRoleMenuDTO) {
    return await this.commandBus.execute(new ReplaceRoleMenuCommand(replaceRoleMenuDTO))
  }

  @Post('batch-replace')
  @ResourceMethod('batchReplace')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'replaceRolesMenu', summary: '批量替换角色的菜单(全量替换)' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async batchReplace(@Body() replaceRolesMenuDTO: ReplaceRolesMenuDTO) {
    return await this.commandBus.execute(new ReplaceRolesMenuCommand(replaceRolesMenuDTO))
  }

  @Get('menu-ids/:id')
  @ResourceMethod('menuIds')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getMenuByRole', summary: '获取角色的菜单ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(MenuIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async menuIds(@Param() roleIdDTO: RoleIdDTO) {
    return this.queryBus.execute(new GetMenuByRoleQuery(roleIdDTO.id))
  }

  @Get('role-ids/:id')
  @ResourceMethod('roleIds')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getRoleByMenu', summary: '获取菜单的角色ID列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(RoleIdsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async roleIds(@Param() menuIdDTO: MenuIdDTO) {
    return this.queryBus.execute(new GetRoleByMenuQuery(menuIdDTO.id))
  }
}
