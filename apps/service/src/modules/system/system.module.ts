import { Module } from '@nestjs/common'
import { UserModule } from '@user/user.module'

/** 系统模块 */
@Module({
  imports: [
    // AuthModule,
    UserModule,
  ],
  exports: [
    // AuthModule,
    UserModule,
  ],
})
export class SystemModule {}
