import type { ISvgCaptchaVO } from '@packages/types'

export class SvgCaptchaVO implements ISvgCaptchaVO {
  token: string
  svg: string
}
