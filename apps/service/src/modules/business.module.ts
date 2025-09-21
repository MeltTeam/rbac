import { Global, Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { SystemModule } from './system/system.module'
/** 业务模块 */
@Global()
@Module({
  imports: [AuthModule, SystemModule],
  exports: [AuthModule, SystemModule],
})
export class BusinessModule {}
