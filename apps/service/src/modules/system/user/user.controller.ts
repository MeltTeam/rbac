import type { IUserController } from './IUser'
import { BaseModule } from '@abstracts/index'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { AddDTO } from './dto/add.dto'
import { DelIdDTO } from './dto/del.dto'
import { FindAllDTO } from './dto/findAll.dto'
import { FindOneIdDTO } from './dto/findOne.dto'
import { PatchDTO, PatchIdDTO } from './dto/patch.dto'
import { DEL_USER_OK, PATCH_USER_OK } from './user.constant'
import { UserService } from './user.service'

@Controller('user')
export class UserController extends BaseModule implements IUserController {
  constructor(private readonly userService: UserService) {
    super()
  }

  @Post()
  async add(@Body() addDTO: AddDTO) {
    return await this.userService.add(addDTO)
  }

  @Delete(':id')
  async del(@Param() delIdDTO: DelIdDTO) {
    await this.userService.del(delIdDTO)
    return DEL_USER_OK
  }

  @Get()
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.userService.findAll(findAllDTO)
  }

  @Get('detail/:id')
  async findOneById(@Param() findOneIdDTO: FindOneIdDTO) {
    return await this.userService.findOne({ id: findOneIdDTO.id })
  }

  @Patch(':id')
  async patch(@Param() patchIdDTO: PatchIdDTO, @Body() patchDTO: PatchDTO) {
    await this.userService.patch(patchIdDTO, patchDTO)
    return PATCH_USER_OK
  }
}
