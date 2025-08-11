import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeptEntity } from '../dept/entities/dept.entity'
import { PostEntity } from '../post/entities/post.entity'
import { ResourceEntity } from '../permission/entities/permission.entity'
import { RoleEntity } from '../role/entities/role.entity'
import { ProfileEntity } from './entities/profile.entity'
import { UserEntity } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

/** 用户模块 */
@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity, ProfileEntity, ResourceEntity, DeptEntity, PostEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
