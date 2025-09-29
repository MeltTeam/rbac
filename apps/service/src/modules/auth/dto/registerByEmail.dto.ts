import type { IRegisterByEmailDTO } from '@packages/types'
import { CAPTCHA } from '@/common/constants'
import { ApiModel } from '@/common/decorators'
import { EMAIL, PWD, USER_NAME } from '@/modules/system/user/user.constant'
import { LoginByEmailDTO } from './loginByEmail.dto'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, example: 'admin' },
    pwd: { type: String, description: PWD, example: 'Aa123456' },
    email: { type: String, description: EMAIL, example: 'Aa123456@qq.com' },
    captcha: { type: String, description: CAPTCHA, example: '123456' },
  },
  { description: '邮箱注册接口参数校验' },
)
export class RegisterByEmailDTO extends LoginByEmailDTO implements IRegisterByEmailDTO {}
