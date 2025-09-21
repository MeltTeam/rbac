import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionEntity } from './entities/permission.entity'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

/** 权限模块 */
@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [TypeOrmModule, PermissionService],
})
export class PermissionModule {}
