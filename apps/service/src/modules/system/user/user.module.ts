import { DeptEntity } from '@dept/entities/dept.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionEntity } from '@permission/entities/permission.entity'
import { PostEntity } from '@post/entities/post.entity'
import { RoleEntity } from '@role/entities/role.entity'
import { UserEntity } from './entities/user.entity'
import { UserProfileEntity } from './entities/userProfile.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

/** 用户模块 */
@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity, UserProfileEntity, PermissionEntity, DeptEntity, PostEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
