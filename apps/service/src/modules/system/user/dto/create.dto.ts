import type { ICreateUserDTO } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN } from '@/common/constants'
import { InputPwd, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, example: 'admin' },
    pwd: { type: String, description: PWD, example: 'Aa123456' },
    remark: { type: String, description: REMARK, example: '张三创建', required: false },
  },
  { description: '创建用户接口参数校验' },
)
export class CreateUserDTO implements ICreateUserDTO {
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
