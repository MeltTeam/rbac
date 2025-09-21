import { RoleBusiness, RoleBusinessTextMap } from '@packages/types'
import { BusinessException } from '@/common/exceptions'

export class RoleException extends BusinessException {
  constructor(code: RoleBusiness) {
    super(
      {
        code,
        message: RoleBusinessTextMap[code][0],
      },
      RoleBusinessTextMap[code][1],
    )
  }
}
