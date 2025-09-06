import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import { PostEntity } from '@/modules/system/post/entities/post.entity'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'
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
