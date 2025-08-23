import type { IEmailCaptchaDTO } from '@packages/types'
import { EMAIL } from '@constants/index'
import { InputEmail, InputSpace, NotEmpty } from '@decorators/index'

export class EmailCaptchaDTO implements IEmailCaptchaDTO {
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
