import type { IEmailCaptchaDTO } from '@packages/types'
import { InputEmail, InputSpace, NotEmpty } from '@/common/decorators'
import { EMAIL } from '@/modules/system/user/user.constant'

export class EmailCaptchaDTO implements IEmailCaptchaDTO {
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
