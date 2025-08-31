import type { IPatchUserDTO } from '@packages/types'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@constants/index'
import { InputEmail, InputSpace, InputStringLength } from '@decorators/index'
import { SexEnum } from '@packages/types'
import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator'
import { EMAIL, NICK_NAME, USER_AVATAR, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'
import { DelIdDTO } from './del.dto'

export class PatchIdDTO extends DelIdDTO {}

export class PatchDTO implements IPatchUserDTO {
  @InputSpace(USER_NAME)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @IsOptional()
  name?: string

  @InputSpace(NICK_NAME)
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, NICK_NAME)
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

  @InputSpace(EMAIL)
  @InputEmail()
  @IsOptional()
  email?: string

  @IsPhoneNumber('CN', {
    message: '请输入正确的手机号格式',
  })
  @IsOptional()
  phone?: string

  @InputSpace(USER_AVATAR)
  @IsOptional()
  avatar?: string

  @InputSpace(REMARK)
  @InputStringLength(REMARK_MIN, REMARK_MAX, REMARK)
  @IsOptional()
  remark?: string
}
