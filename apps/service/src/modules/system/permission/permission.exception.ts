import { PermissionBusiness, PermissionBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'

export class PermissionException extends BusinessException {
  constructor(code: PermissionBusiness) {
    super(
      {
        code,
        message: PermissionBusinessTextMap[code][0],
      },
      PermissionBusinessTextMap[code][1],
    )
  }
}
