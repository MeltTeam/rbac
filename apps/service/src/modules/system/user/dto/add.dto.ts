import type { IAddUserDTO } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@/common/constants'
import { InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

/** 添加用户接口参数校验 */
export class AddDTO implements IAddUserDTO {
  @NotEmpty(USER_NAME)
  @InputSpace(USER_NAME)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  name: string

  @NotEmpty(PWD)
  @InputSpace(PWD)
  @InputPwd()
  @InputStringLength(PWD_MIN, PWD_MAX, PWD)
  pwd: string

  @InputSpace(REMARK)
  @InputStringLength(REMARK_MIN, REMARK_MAX, REMARK)
  @IsOptional()
  remark?: string
}
