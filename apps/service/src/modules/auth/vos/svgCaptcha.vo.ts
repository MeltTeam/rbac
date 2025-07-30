import type { ISvgCaptchaVo } from '@packages/types'

export class SvgCaptchaVo implements ISvgCaptchaVo {
  token: string
  svg: string
}
