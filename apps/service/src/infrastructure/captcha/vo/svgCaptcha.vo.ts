import type { ISvgCaptchaVO } from '@packages/types'
import { ApiModel } from '@/common/decorators/swagger.decorator'

@ApiModel(
  {
    token: { type: String, description: 'svg验证码凭证' },
    svg: { type: String, description: 'svg验证码' },
  },
  { description: 'svg验证码数据' },
)
export class SvgCaptchaVO implements ISvgCaptchaVO {
  token: string
  svg: string
  constructor(svgCaptcha?: ISvgCaptchaVO) {
    if (svgCaptcha) {
      const { svg, token } = svgCaptcha
      this.svg = svg
      this.token = token
    }
  }
}
