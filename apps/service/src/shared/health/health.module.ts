import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'
import { RedisHealthIndicator } from './redis.health'

/** 健康检测模块 */
@Module({
  controllers: [HealthController],
  imports: [
    TerminusModule.forRoot({
      logger: false,
      gracefulShutdownTimeoutMs: 1000,
    }),
  ],
  providers: [RedisHealthIndicator],
  exports: [RedisHealthIndicator, TerminusModule],
})
export class HealthModule {}
