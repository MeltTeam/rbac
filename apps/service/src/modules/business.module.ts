import { Global, Module } from '@nestjs/common'
import { SystemModule } from './system'
/** 业务模块 */
@Global()
@Module({
  imports: [...SystemModule],
  exports: [...SystemModule],
})
export class BusinessModule {}
