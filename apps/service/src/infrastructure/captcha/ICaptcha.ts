import type { ConfigObject as SvgCaptchaConfig } from 'svg-captcha'
import type { SvgCaptchaVO } from './vo/svgCaptcha.vo'

export type CaptchaName = 'svg' | 'email'

/** 验证码类型 */
export type CaptchaType = 'test' | 'register' | 'login' | 'resetPwd'

/** 创建验证码key的配置 */
export interface ICreateCaptchaKeyOptions {
  /** 验证码名 */
  name: CaptchaName
  /** 验证码类型 */
  type: CaptchaType
  /** 唯一ID */
  id: string
}

/** 节流锁配置 */
export interface IThrottleLockOptions extends ICreateCaptchaKeyOptions {
  /** 节流时间 */
  timer: number
  /** 次数 */
  num: number
}

export interface IGenerateEmailCaptchaOptions {
  /** 接收方 */
  to: string
  /** 主题 */
  subject: string
  /** 模板名 */
  template: string
  /** 验证码类型(用于redis同一个邮箱不同功能的key) */
  type: CaptchaType
}

/** 验证码服务接口 */
export interface ICaptchaService {
  /**
   * 创建验证码key
   * @param options 创建验证码key的配置
   */
  createCaptchaKey: (options: ICreateCaptchaKeyOptions) => string

  /**
   * 生成svg验证码
   * @param type 验证码类型
   * @param svgCaptchaConfig svg验证码配置
   */
  generateSvgCaptcha: (type: CaptchaType, svgCaptchaConfig?: SvgCaptchaConfig) => Promise<SvgCaptchaVO>

  /**
   * 生成邮箱验证码
   * @param options 生成邮箱验证码配置
   */
  generateEmailCaptcha: (options: IGenerateEmailCaptchaOptions) => Promise<string>

  /**
   * 删除验证码
   * @param options 创建验证码key的配置
   */
  delCaptcha: (options: ICreateCaptchaKeyOptions) => Promise<void>

  /**
   * 验证验证码
   * @param code 验证码
   * @param options 创建验证码key的配置
   */
  verifyCaptcha: (code: string, options: ICreateCaptchaKeyOptions) => Promise<void>

  /**
   * 节流锁
   * @param options 节流锁配置
   */
  throttleLock: (options: IThrottleLockOptions) => Promise<void>
}
