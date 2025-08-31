import { UserBusiness, UserBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'

export class UserException extends BusinessException {
  constructor(code: UserBusiness) {
    super(
      {
        code,
        message: UserBusinessTextMap[code][0],
      },
      UserBusinessTextMap[code][1],
    )
  }
}
