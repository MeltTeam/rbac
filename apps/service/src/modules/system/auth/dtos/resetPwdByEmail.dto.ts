import type { IResetPwdByEmailDTO } from '@packages/types'
import { InputCompare, InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { PWD, PWD_MAX, PWD_MIN } from '@/modules/system/user/user.constant'
import { LoginByEmailDTO } from './loginByEmail.dto'

export class ResetPwdByEmailDTO extends LoginByEmailDTO implements IResetPwdByEmailDTO {
  @InputCompare(['password'])
  @NotEmpty(PWD)
  @InputSpace(PWD)
  @InputPwd()
  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  confirmPwd: string
}
