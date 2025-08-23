import type { IPatchUserDTO } from '@packages/types'
import { EMAIL, REMARK, REMARK_MAX, REMARK_MIN } from '@constants/index'
import { InputEmail, InputLength, InputSpace } from '@decorators/index'
import { SexEnum } from '@packages/types'
import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator'
import { NICK_NAME, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'
import { DelIdDTO } from './del.dto'

export class PatchIdDTO extends DelIdDTO {}

export class PatchDTO implements IPatchUserDTO {
  @InputLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @IsOptional()
  name?: string

  @InputLength(USER_NAME_MIN, USER_NAME_MAX, NICK_NAME)
  @InputSpace(NICK_NAME)
  @IsOptional()
  nickName?: string

  @IsEnum(SexEnum, {
    message: '请输入正确的性别格式',
  })
  @IsOptional()
  sex?: SexEnum

  @IsDate({
    message: '请输入正确的日期格式',
  })
  @IsOptional()
  birthday?: Date

  @InputEmail()
  @InputSpace(EMAIL)
  @IsOptional()
  email?: string

  @IsPhoneNumber('CH', {
    message: '请输入正确的手机号格式',
  })
  @IsOptional()
  phone?: string

  @InputSpace('头像')
  @IsOptional()
  avatar?: string

  @InputLength(REMARK_MIN, REMARK_MAX, REMARK)
  @InputSpace(REMARK)
  @IsOptional()
  remark?: string
}
