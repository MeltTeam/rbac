import type { IPatchUserDto } from '@packages/types'
import { SexEnum } from '@packages/types'
import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator'
import { EMAIL, NICK_NAME, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/common/constants'
import { InputEmail, InputLength, InputSpace } from '@/common/decorators'
import { DelDto } from './del.dto'

export class PatchIdDto extends DelDto {}

export class PatchDto implements IPatchUserDto {
  @InputLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @IsOptional()
  username?: string

  @InputLength(USER_NAME_MIN, USER_NAME_MAX, NICK_NAME)
  @InputSpace(NICK_NAME)
  @IsOptional()
  nickName?: string

  @IsEnum(SexEnum, {
    message: 'aaaa',
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
}
