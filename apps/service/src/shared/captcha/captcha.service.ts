import type { ISvgCaptchaVO } from '@packages/types'
import type { ConfigObject } from 'svg-captcha'
import type { CaptchaType, ICaptchaService, ICreateCaptchaKey } from './ICaptcha'
import type { AppConfigType } from '@/configs'
import { LikeCache2Module } from '@cache2/LikeCache2Module.abstract'
import { CAPTCHA_LENGTH } from '@constants/index'
import { EmailService } from '@email/email.service'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getCode, uuid_v4 } from '@utils/index'
import Redis from 'ioredis'
import { create } from 'svg-captcha'
import { APP_CONFIG_KEY } from '@/configs'
import { CAPTCHA_REDIS_CLIENT_TOKEN } from './captcha.constant'

@Injectable()
export class CaptchaService extends LikeCache2Module implements ICaptchaService {
  constructor(
    @Inject(CACHE_MANAGER) memory: Cache,
    @Inject(CAPTCHA_REDIS_CLIENT_TOKEN) redis: Redis,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    super({
      className: CaptchaService.name,
      redis,
      memory,
    })
  }

  createCaptchaKey(options: ICreateCaptchaKey) {
    const { name, id, type } = options
    return `${name}:${id}:${type}`
  }

  async generateSvgCaptcha(type: CaptchaType, svgCaptchaConfig?: ConfigObject): Promise<ISvgCaptchaVO> {
    const background = `#${getCode(6, 16)}`
    const token = uuid_v4()
    const key = this.createCaptchaKey({
      id: token,
      name: 'svg',
      type,
    })
    // 生成
    const { data, text } = create({
      /** 噪波线 */
      noise: 6,
      size: CAPTCHA_LENGTH,
      background,
      ...svgCaptchaConfig,
    })
    // 缓存
    this.set(key, text, 5 * 60 * 1000).then(
      () => this.logger.debug(`${this.generateSvgCaptcha.name}:${key}:${text}`),
      (e) => {
        this.redis.ping()
        this.logger.error(`${this.generateSvgCaptcha.name}:${e.message}`)
      },
    )
    const svgBse64 = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    return {
      token,
      svg: svgBse64,
    }
  }

  async delSvgCaptcha(token: string, type: CaptchaType) {
    const key = this.createCaptchaKey({
      id: token,
      name: 'svg',
      type,
    })
    return await this.del(key)
  }

  async verifySvgCaptcha(token: string, text: string, type: CaptchaType) {
    const key = this.createCaptchaKey({
      id: token,
      name: 'svg',
      type,
    })

    const redisText = await this.get(key)

    /** 找不到 */
    if (!redisText) throw new HttpException(`验证码已过期`, HttpStatus.BAD_REQUEST)
    /** 对不上 */
    if (redisText.toLowerCase() !== text.toLowerCase()) throw new HttpException(`验证码错误`, HttpStatus.BAD_REQUEST)
    return await this.delSvgCaptcha(token, type)
  }

  async generateEmailCaptcha(to: string, subject: string, template: string, type: CaptchaType) {
    /** 单个邮箱地址3分钟内只能发送2次 */
    const throttleNum = 2
    const throttleKey = `email:throttle:${to}:${type}`
    /** 没有就设置，有就更新 */
    const old = await this.get<number>(throttleKey)
    Object.is(old, null) ? await this.set(throttleKey, 1, 3 * 60 * 1000) : await this.update(throttleKey, +old! + 1)
    if (+old! >= throttleNum) throw new HttpException('当前邮箱地址发送验证码次数过多,请稍后重试!!!', HttpStatus.TOO_MANY_REQUESTS)
    /** 生成验证码 */
    const code = getCode(CAPTCHA_LENGTH, 16)
    const key = this.createCaptchaKey({
      id: to,
      name: 'email',
      type,
    })
    this.set(key, code, 3 * 60 * 1000).then(
      () => {
        this.logger.debug(`${this.generateEmailCaptcha.name}:${key}:${code}`)
        const { name: APP_NAME } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
        return this.emailService.sendEmail({
          fromName: subject,
          to,
          subject,
          template,
          context: {
            subject,
            APP_NAME,
            code,
          },
        })
      },
      (e) => {
        this.redis.ping()
        this.logger.error(`${this.generateEmailCaptcha.name}:${e.message}`)
      },
    )
    return '邮件验证码发送成功'
  }

  async delEmailCaptcha(email: string, type: CaptchaType) {
    const key = this.createCaptchaKey({
      id: email,
      name: 'email',
      type,
    })
    return await this.del(key)
  }

  async verifyEmailCaptcha(email: string, code: string, type: CaptchaType) {
    const key = this.createCaptchaKey({
      id: email,
      name: 'email',
      type,
    })
    const redisCode = await this.get(key)
    /** 找不到 */
    if (!redisCode) throw new HttpException(`验证码已过期`, HttpStatus.BAD_REQUEST)
    /** 对不上 */
    if (redisCode !== code) throw new HttpException(`验证码错误`, HttpStatus.BAD_REQUEST)

    return await this.delEmailCaptcha(email, type)
  }
}
