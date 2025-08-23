import type { CaptchaConfigType } from '@/configs'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisModule } from '@redis/redis.module'
import { CAPTCHA_CONFIG_KEY } from '@/configs'
import { CAPTCHA_REDIS_CLIENT_TOKEN } from './captcha.constant'
import { CaptchaService } from './captcha.service'
/** 验证码模块(连redis的db3) */
@Module({
  imports: [
    RedisModule.forRootAsync({
      isGlobal: true,
      serviceClass: [CaptchaService],
      redisClientToken: CAPTCHA_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<CaptchaConfigType>(CAPTCHA_CONFIG_KEY)!
        return config
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
