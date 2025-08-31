import { CaptchaBusiness, CaptchaBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'

export class CaptchaException extends BusinessException {
  constructor(code: CaptchaBusiness) {
    super(
      {
        code,
        message: CaptchaBusinessTextMap[code][0],
      },
      CaptchaBusinessTextMap[code][1],
    )
  }
}
