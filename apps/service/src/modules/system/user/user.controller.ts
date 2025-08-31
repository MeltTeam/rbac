import type { IUserController } from './IUser'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { AddDTO } from './dto/add.dto'
import { DelIdDTO } from './dto/del.dto'
import { FindAllDTO } from './dto/findAll.dto'
import { FindOneIdDTO } from './dto/findOne.dto'
import { PatchDTO, PatchIdDTO } from './dto/patch.dto'
import { DEL_USER_OK, PATCH_USER_OK } from './user.constant'
import { UserService } from './user.service'

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async add(@Body() addDTO: AddDTO) {
    return await this.userService.handlerAdd(addDTO)
  }

  @Delete(':id')
  async delById(@Param() delIdDTO: DelIdDTO) {
    await this.userService.handlerDel(delIdDTO)
    return DEL_USER_OK
  }

  @Get()
  async findAll(@Query() findAllDTO: FindAllDTO) {
    return await this.userService.handlerFindAll(findAllDTO)
  }

  @Get('detail/:id')
  async findOneById(@Param() findOneIdDTO: FindOneIdDTO) {
    return await this.userService.handlerFindOne({ id: findOneIdDTO.id })
  }

  @Patch(':id')
  async patchById(@Param() patchIdDTO: PatchIdDTO, @Body() patchDTO: PatchDTO) {
    await this.userService.handlerPatch(patchIdDTO, patchDTO)
    return PATCH_USER_OK
  }
}
