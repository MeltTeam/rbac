import type { JwtConfigType } from '@/configs'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JWT_CONFIG_KEY } from '@/configs'
import { WinstonLogger } from '@/infrastructure/logger2/logger2.util'
import { RedisModule } from '@/infrastructure/redis/redis.module'
import { JWT_REDIS_CLIENT_TOKEN } from './jwt2.constant'
import { Jwt2Service } from './jwt2.service'

@Module({
  imports: [
    /** jwt 模块 */
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const { serviceConfig } = configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
        return serviceConfig
      },
      inject: [ConfigService],
    }),
    /** 缓存jwt模块 */
    RedisModule.forRootAsync({
      isGlobal: true,
      serviceClass: [Jwt2Service],
      redisClientToken: JWT_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const { connectConfig } = configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
        return connectConfig
      },
      inject: [ConfigService],
      logger: Jwt2Module.logger,
      loggerContext: Jwt2Module.name,
    }),
  ],
  providers: [Jwt2Service, JwtService],
  exports: [Jwt2Service, JwtService],
})
export class Jwt2Module {
  static logger: WinstonLogger = new WinstonLogger()
}
