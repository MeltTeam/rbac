import { Global, Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
/** 业务模块 */
@Global()
@Module({
  imports: [AuthModule, UserModule],
  exports: [AuthModule, UserModule],
})
export class BusinessModule {}
