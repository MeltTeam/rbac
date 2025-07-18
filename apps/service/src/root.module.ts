import type { ConfigFactory } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { ConfigModule as Config2Module } from '@nestjs/config'
import { ALL_CONFIG } from './configs'
import { TestModule } from './modules/test/test.module'
import { SharedModule } from './shared/shared.module'

/** 根模块 */
@Module({
  imports: [
    /** 配置模块 */
    Config2Module.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: ['.env.local', `.env.${process.env.ENV_NAME}`, '.env'],
      load: [...Object.values<ConfigFactory>(ALL_CONFIG)],
      cache: true,
    }),
    SharedModule,
    TestModule,
  ],
  providers: [],
})
export class RootModule {}
