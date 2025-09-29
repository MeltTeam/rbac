import type { IUpdateUserDTO } from '@packages/types'
import { SexEnum } from '@packages/types'
import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@/common/constants'
import { ApiModel, InputEmail, InputSpace, InputStringLength } from '@/common/decorators'
import { EMAIL, NICK_NAME, USER_AVATAR, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, minLength: USER_NAME_MIN, maxLength: USER_NAME_MAX, example: 'admin', required: false },
    nickName: { type: String, description: NICK_NAME, minLength: USER_NAME_MIN, maxLength: USER_NAME_MAX, example: '张三', required: false },
    sex: { enum: SexEnum, description: '性别(未知:10 男:20 女:30)', example: SexEnum.MALE, required: false },
    birthday: { type: Date, description: '生日', example: '2000-01-01', required: false },
    email: { type: String, description: EMAIL, example: 'Aa123456@qq.com', required: false },
    phone: { type: String, description: '手机号', example: '13800138000', required: false },
    avatar: { type: String, description: USER_AVATAR, example: 'https://example.com/avatar.jpg', required: false },
    remark: { type: String, description: REMARK, minLength: REMARK_MIN, maxLength: REMARK_MAX, example: 'xxx', required: false },
  },
  { description: '更新用户接口参数校验' },
)
export class UpdateUserDTO implements IUpdateUserDTO {
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
