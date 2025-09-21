import type { AuthBusiness } from '@packages/types'
import { AuthBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'

export class AuthException extends BusinessException {
  constructor(code: AuthBusiness) {
    super(
      {
        code,
        message: AuthBusinessTextMap[code][0],
      },
      AuthBusinessTextMap[code][1],
    )
  }
}
