import type { CommonBusiness } from '@packages/types'
import { HttpException } from '@nestjs/common'
import { CommonBusinessTextMap } from '@packages/types'

/** 业务错误类型 */
export class BusinessException extends HttpException {}
export class CommonBusinessException extends BusinessException {
  constructor(code: CommonBusiness) {
    super(
      {
        code,
        message: CommonBusinessTextMap[code][0],
      },
      CommonBusinessTextMap[code][1],
    )
  }
}
