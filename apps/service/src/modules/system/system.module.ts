import { Module } from '@nestjs/common'
import { DeptModule } from './dept/dept.module'
import { MenuModule } from './menu/menu.module'
import { PermissionModule } from './permission/permission.module'
import { PostModule } from './post/post.module'
import { ResourceModule } from './resource/resource.module'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'

/** 系统模块 */
@Module({
  imports: [RoleModule, PermissionModule, MenuModule, ResourceModule, DeptModule, PostModule, UserModule],
  exports: [RoleModule, PermissionModule, MenuModule, ResourceModule, DeptModule, PostModule, UserModule],
})
export class SystemModule {}
