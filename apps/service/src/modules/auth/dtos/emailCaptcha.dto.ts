import type { IEmailCaptchaDto } from '@packages/types'
import { EMAIL } from '@/common/constants'
import { InputEmail, InputSpace, NotEmpty } from '@/common/decorators'

export class EmailCaptchaDto implements IEmailCaptchaDto {
  @InputEmail()
  @InputSpace(EMAIL)
  @NotEmpty(EMAIL)
  email: string
}
