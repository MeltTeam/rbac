import type { IUserController } from './IUser'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators/swagger.decorator'
import { FindAllDTO } from '@/common/dto/findAll.dto'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { CreateDTO, DelByIdDTO, FindOneByIdDTO, PatchByIdDTO, PatchDTO } from './dto'
import { DEL_BY_ID_VO, PATCH_VO } from './user.constant'
import { UserService } from './user.service'
import { FindAllUserVO, UserVO } from './vo'

@Controller('user')
@ApiController({ ApiTagsOptions: ['用户模块'] })
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建用户' }],
    ApiResponseOptions: [{ type: UserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create(@Body() createDTO: CreateDTO) {
    return await this.userService.create(createDTO)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除用户' }],
    ApiResponseOptions: [{ type: String, example: DEL_BY_ID_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async delById(@Param() delByIdDTO: DelByIdDTO) {
    await this.userService.delById(delByIdDTO)
    return DEL_BY_ID_VO
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分页查询用户详情' }],
    ApiResponseOptions: [{ type: FindAllUserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.userService.findAll(findAllDTO)
  }

  @UseGuards(JwtGuard)
  @Get('detail/:id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查询用户详情' }],
    ApiResponseOptions: [{ type: UserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findOneById(@Param() findOneByIdDTO: FindOneByIdDTO) {
    return await this.userService.findOneById(findOneByIdDTO)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '修改用户' }],
    ApiResponseOptions: [{ type: String, example: PATCH_VO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async patch(@Param() patchByIdDTO: PatchByIdDTO, @Body() patchDTO: PatchDTO) {
    await this.userService.patch(patchByIdDTO, patchDTO)
    return PATCH_VO
  }
}
