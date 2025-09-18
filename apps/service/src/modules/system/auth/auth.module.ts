import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import { PostEntity } from '@/modules/system/post/entities/post.entity'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'
import { UserEntity } from '@/modules/system/user/entities/user.entity'
import { UserProfileEntity } from '@/modules/system/user/entities/userProfile.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategys/jwt.strategy'
import { LocalStrategy } from './strategys/local.strategy'

/** 权限模块 */
@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([RoleEntity, UserEntity, UserProfileEntity, PermissionEntity, DeptEntity, PostEntity])],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
