import type { IAddUserDTO } from '@packages/types'
import { PWD, PWD_MAX, PWD_MIN, REMARK, REMARK_MAX, REMARK_MIN } from '@constants/index'
import { InputLength, InputPwd, InputSpace, NotEmpty } from '@decorators/index'
import { IsOptional } from 'class-validator'
import { USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

/** 添加用户接口参数校验 */
export class AddDTO implements IAddUserDTO {
  @InputLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string

  @InputPwd()
  @InputLength(PWD_MIN, PWD_MAX, PWD)
  @InputSpace(PWD)
  @NotEmpty(PWD)
  pwd: string

  @InputLength(REMARK_MIN, REMARK_MAX, REMARK)
  @InputSpace(REMARK)
  @IsOptional()
  remark?: string
}
