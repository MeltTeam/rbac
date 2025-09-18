import type { IPatchUserDTO } from '@packages/types'
import { SexEnum } from '@packages/types'
import { IsDate, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@/common/constants'
import { InputEmail, InputSpace, InputStringLength } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { EMAIL, NICK_NAME, USER_AVATAR, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'
import { DelByIdDTO } from './delById.dto'

@ApiModel({
  id: { type: String, description: '用户ID' },
})
export class PatchByIdDTO extends DelByIdDTO {}

@ApiModel(
  {
    name: { type: String, description: USER_NAME, example: 'xxx', required: false },
    nickName: { type: String, description: NICK_NAME, example: '张三', required: false },
    sex: { enum: SexEnum, description: '性别：10 未知 男 20 女 30', example: 20, required: false },
    birthday: { type: Date, description: '生日', example: '2000-01-01', required: false },
    email: { type: String, description: EMAIL, example: 'zhangsan@example.com', required: false },
    phone: { type: String, description: '手机号', example: '13800138000', required: false },
    avatar: { type: String, description: USER_AVATAR, example: 'https://example.com/avatar.jpg', required: false },
    remark: { type: String, description: REMARK, example: 'xxx', required: false },
  },
  { description: '修改用户接口参数校验' },
)
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
