import type { CaptchaConfigType } from '@/configs/captcha.config'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisModule } from '@shared/redis/redis.module'
import { CAPTCHA_CONFIG_KEY } from '@/configs/captcha.config'
import { CaptchaService } from './captcha.service'
import { CAPTCHA_REDIS_CLIENT_TOKEN } from './constants'
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
