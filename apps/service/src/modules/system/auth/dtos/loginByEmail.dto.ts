import type { ILoginByEmailDTO } from '@packages/types'
import { CAPTCHA, CAPTCHA_LENGTH } from '@constants/index'
import { InputEmail, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@decorators/index'
import { EMAIL, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@user/user.constant'

export class LoginByEmailDTO implements ILoginByEmailDTO {
  @NotEmpty(USER_NAME)
  @InputSpace(USER_NAME)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  name: string

  @NotEmpty(PWD)
  @InputSpace(PWD)
  @InputPwd()
  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  pwd: string

  @NotEmpty(EMAIL)
  @InputSpace(EMAIL)
  @InputEmail()
  email: string

  @NotEmpty(CAPTCHA)
  @InputSpace(CAPTCHA)
  @InputStringLength(CAPTCHA_LENGTH, CAPTCHA_LENGTH, CAPTCHA)
  captcha: string
}
