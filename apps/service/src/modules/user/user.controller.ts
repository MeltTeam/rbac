import type { DelUserOK } from './interfaces/IUserController'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'
import { AddDto, DelDto, FindAllDto } from './dtos'
import { UserService } from './user.service'

@Controller('user')
export class UserController extends BaseModule {
  constructor(private readonly userService: UserService) {
    super()
  }

  @Post()
  async add(@Body() addDto: AddDto) {
    return await this.userService.add(addDto)
  }

  @Delete(':id')
  async del(@Param() delDto: DelDto): Promise<DelUserOK> {
    await this.userService.del(delDto)
    return '删除用户成功'
  }

  @Get()
  async findAll(@Query() findAllDto: FindAllDto) {
    return this.userService.findAll(findAllDto)
  }

  @Get(':id')
  async findOne() {}

  @Patch()
  async patch() {}
}
