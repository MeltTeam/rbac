import type { IMenuController } from '../IMenuController'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiExtraModels } from '@nestjs/swagger'
import { ResourceTypeEnum } from '@packages/types'
import { ApiController, ApiMethod, IsPublic, ResourceDomain, ResourceMethod, ResourceType } from '@/common/deco'
import { FindAllDTO, GetTreeDepthDTO, GetTreesDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import { ResVO } from '@/common/vo'
import {
  CreateMenuCommand,
  CreateMenuDTO,
  DeleteMenuCommand,
  FindAllMenuVO,
  GetMenuByIdQuery,
  GetMenusQuery,
  GetMenuTreeQuery,
  GetMenuTreesQuery,
  MenuDetailsVO,
  MenuIdDTO,
  MenuTreeVO,
  MoveMenuCommand,
  MoveMenuDTO,
  UpdateMenuCommand,
  UpdateMenuDTO,
  UpdateMenuSortCommand,
  UpdateMenuStatusCommand,
} from '../../../app'

/** 菜单控制器实现 */
@Controller('menu')
@ResourceType(ResourceTypeEnum.API)
@ResourceDomain('MENU')
@ApiController({ ApiTagsOptions: ['Menu'] })
@IsPublic()
@ApiExtraModels(FindAllMenuVO, MenuDetailsVO, MenuTreeVO)
export class MenuController implements IMenuController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ResourceMethod('create')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'createMenu', summary: '创建菜单' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(MenuDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async create(@Body() createMenuDTO: CreateMenuDTO) {
    return await this.commandBus.execute(new CreateMenuCommand(createMenuDTO))
  }

  @Delete(':id')
  @ResourceMethod('delete')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'deleteMenu', summary: '删除菜单' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async delete(@Param() menuIdDTO: MenuIdDTO) {
    return await this.commandBus.execute(new DeleteMenuCommand(menuIdDTO.id))
  }

  @Patch(':id')
  @ResourceMethod('update')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'updateMenu', summary: '更新菜单' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async update(@Param() menuIdDTO: MenuIdDTO, @Body() updateMenuDTO: UpdateMenuDTO) {
    return await this.commandBus.execute(new UpdateMenuCommand(menuIdDTO.id, updateMenuDTO))
  }

  @Patch(':id/status')
  @ResourceMethod('updateStatus')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'updateMenuStatus', summary: '更新菜单状态' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateStatus(@Param() menuIdDTO: MenuIdDTO, @Body() updateStatusDTO: UpdateStatusDTO) {
    return await this.commandBus.execute(new UpdateMenuStatusCommand(menuIdDTO.id, updateStatusDTO))
  }

  @Patch(':id/sort')
  @ResourceMethod('updateSort')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'updateMenuSort', summary: '更新菜单排序优先级' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async updateSort(@Param() menuIdDTO: MenuIdDTO, @Body() updateSortDTO: UpdateSortDTO) {
    return await this.commandBus.execute(new UpdateMenuSortCommand(menuIdDTO.id, updateSortDTO))
  }

  @Get()
  @ResourceMethod('list')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getMenus', summary: '获取菜单列表' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(FindAllMenuVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async list(@Query() findAllDTO: FindAllDTO) {
    return await this.queryBus.execute(new GetMenusQuery(findAllDTO))
  }

  @Get(':id')
  @ResourceMethod('detail')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getMenuById', summary: '查看单个菜单详情' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(MenuDetailsVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async detail(@Param() menuIdDTO: MenuIdDTO) {
    return await this.queryBus.execute(new GetMenuByIdQuery(menuIdDTO.id))
  }

  @Patch(':id/move')
  @ResourceMethod('move')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'moveMenu', summary: '移动菜单' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess()],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async move(@Param() menuIdDTO: MenuIdDTO, @Body() moveMenuDTO: MoveMenuDTO) {
    return await this.commandBus.execute(new MoveMenuCommand(menuIdDTO.id, moveMenuDTO))
  }

  @Get('tree/:id')
  @ResourceMethod('tree')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getMenuTree', summary: '查看单个菜单树结构' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(MenuTreeVO)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async tree(@Param() menuIdDTO: MenuIdDTO, @Query() getTreeDepthDTO: GetTreeDepthDTO) {
    return await this.queryBus.execute(new GetMenuTreeQuery(menuIdDTO.id, getTreeDepthDTO))
  }

  @Post('trees')
  @ResourceMethod('trees')
  @ApiMethod({
    ApiOperationOptions: [{ description: 'getMenuTrees', summary: '查看多个菜单树结构' }],
    ApiResponseOptions: [ResVO.SwaggerSuccess(MenuTreeVO, true)],
    ApiBearerAuthOptions: 'JWT',
    ApiCookieAuthOptions: 'COOKIE-JWT',
  })
  async trees(@Body() getTreesDTO: GetTreesDTO) {
    return await this.queryBus.execute(new GetMenuTreesQuery(getTreesDTO))
  }
}
