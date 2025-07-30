import type { IAddUserDto } from '@packages/types'
import { PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/common/constants'
import { InputLength, InputPwd, InputSpace, NotEmpty } from '@/common/decorators'

export class AddDto implements IAddUserDto {
  @InputLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  username: string

  @InputPwd()
  @InputLength(PWD_MIN, PWD_MAX, PWD)
  @InputSpace(PWD)
  @NotEmpty(PWD)
  password: string
}
