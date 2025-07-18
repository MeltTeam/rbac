import type { ISvgCaptchaVo } from '@packages/types'
import type { ConfigObject as SvgCaptchaConfig } from 'svg-captcha'

export type CaptchaName = 'svg' | 'email'

/** 验证码类型 */
export type CaptchaType = 'test' | 'register' | 'login' | 'resetPwd'

/** 创建验证码key的配置 */
export interface ICreateCaptchaKey {
  /** 验证码名 */
  name: CaptchaName
  /** 唯一ID */
  id: string
  /** 验证码类型 */
  type: CaptchaType
}

/** redis服务接口 */
export interface ICaptchaService {
  /**
   * 写入string，用于存储邮箱验证码、短信验证码
   * @param key 键名
   * @param value 值
   * @param ttl 过期时间(default: 60 * 1000)
   */
  set: (key: string, value: unknown, ttl?: number) => Promise<boolean>

  /**
   * 获取string，用于存储邮箱验证码、短信验证码
   * @param key 键名
   */
  get: <T = any>(key: string) => Promise<T | null>

  /**
   * 删除数据
   * @param key 键名
   */
  del: (key: string) => Promise<boolean>

  /**
   * 更新数据
   * @param key 键名
   * @param value 更新的值
   */
  update: (key: string, value: unknown) => Promise<boolean>

  /**
   * 创建验证码key
   * @param options 创建验证码key的配置
   */
  createCaptchaKey: (options: ICreateCaptchaKey) => string

  /**
   * 生成svg验证码
   * @param type 验证码类型
   * @param svgCaptchaConfig svg验证码配置
   */
  generateSvgCaptcha: (type: CaptchaType, svgCaptchaConfig?: SvgCaptchaConfig) => Promise<ISvgCaptchaVo>

  /**
   * 验证svg验证码
   * @param token 凭证
   * @param text 验证码
   * @param type 验证码类型
   */
  verifySvgCaptcha: (token: string, text: string, type: CaptchaType) => Promise<void>

  /**
   * 删除svg验证码
   * @param token 凭证
   * @param type 验证码类型
   */
  delSvgCaptcha: (token: string, type: CaptchaType) => Promise<void>

  /**
   * 生成邮箱验证码
   * @param to 接收方
   * @param subject 主题
   * @param template 模板名
   * @param type 验证码类型(用于redis同一个邮箱不同功能的key)
   */
  generateEmailCaptcha: (to: string, subject: string, template: string, type: CaptchaType) => Promise<string>

  /**
   * 验证邮箱验证码
   * @param email 邮箱
   * @param code 验证码
   * @param type 验证码类型(用于redis同一个邮箱不同功能的key)
   */
  verifyEmailCaptcha: (email: string, code: string, type: CaptchaType) => Promise<void>

  /**
   * 删除邮箱验证码
   * @param email 邮箱
   * @param type 验证码类型(用于redis同一个邮箱不同功能的key)
   */
  delEmailCaptcha: (email: string, type: CaptchaType) => Promise<void>
}
