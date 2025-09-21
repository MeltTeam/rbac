import { Module } from '@nestjs/common'
import { DeptModule } from './dept/dept.module'
import { PermissionModule } from './permission/permission.module'
import { PostModule } from './post/post.module'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'

/** 系统模块 */
@Module({
  imports: [RoleModule, PermissionModule, DeptModule, PostModule, UserModule],
  exports: [RoleModule, PermissionModule, DeptModule, PostModule, UserModule],
})
export class SystemModule {}
