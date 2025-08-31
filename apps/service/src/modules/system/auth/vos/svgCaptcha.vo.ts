import type { ISvgCaptchaVO } from '@packages/types'

export class SvgCaptchaVO implements ISvgCaptchaVO {
  token: string
  svg: string
  constructor({ svg, token }) {
    this.svg = svg
    this.token = token
  }
}
