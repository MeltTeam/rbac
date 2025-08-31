import type { IEmailCaptchaDTO } from '@packages/types'
import { InputEmail, InputSpace, NotEmpty } from '@decorators/index'
import { EMAIL } from '@user/user.constant'

export class EmailCaptchaDTO implements IEmailCaptchaDTO {
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
