import type { IUserController } from './IUser'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators/swagger.decorator'
import { AddDTO } from './dto/add.dto'
import { DelIdDTO } from './dto/del.dto'
import { FindAllDTO } from './dto/findAll.dto'
import { FindOneIdDTO } from './dto/findOne.dto'
import { PatchDTO, PatchIdDTO } from './dto/patch.dto'
import { DEL_USER_OK, PATCH_USER_OK } from './user.constant'
import { UserService } from './user.service'
import { FindAllVO, UserVO } from './vo'

@ApiController({ ApiTagsOptions: ['用户模块'] })
@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '添加用户' }],
    ApiResponseOptions: [{ type: UserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async add(@Body() addDTO: AddDTO) {
    return await this.userService.handlerAdd(addDTO)
  }

  @Delete(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '删除用户' }],
    ApiResponseOptions: [{ type: String, example: DEL_USER_OK }],
    ApiBearerAuthOptions: 'JWT',
  })
  async delById(@Param() delIdDTO: DelIdDTO) {
    await this.userService.handlerDel(delIdDTO)
    return DEL_USER_OK
  }

  @Get()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '分页查询用户详情' }],
    ApiResponseOptions: [{ type: FindAllVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.userService.handlerFindAll(findAllDTO)
  }

  @Get('detail/:id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '查询用户详情' }],
    ApiResponseOptions: [{ type: UserVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async findOneById(@Param() findOneIdDTO: FindOneIdDTO) {
    return await this.userService.handlerFindOne({ id: findOneIdDTO.id })
  }

  @Patch(':id')
  @ApiMethod({
    ApiOperationOptions: [{ summary: '修改用户' }],
    ApiResponseOptions: [{ type: String, example: PATCH_USER_OK }],
    ApiBearerAuthOptions: 'JWT',
  })
  async patchById(@Param() patchIdDTO: PatchIdDTO, @Body() patchDTO: PatchDTO) {
    await this.userService.handlerPatch(patchIdDTO, patchDTO)
    return PATCH_USER_OK
  }
}
