import type { ICreateRoleDTO } from '@packages/types'
import { IsOptional } from 'class-validator'
import { REMARK, REMARK_MAX, REMARK_MIN, UUID_V4_LENGTH } from '@/common/constants'
import { InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ApiModel } from '@/common/decorators/swagger.decorator'
import { ROLE_CODE, ROLE_CODE_MAX, ROLE_CODE_MIN, ROLE_NAME, ROLE_NAME_MAX, ROLE_NAME_MIN, ROLE_PARENT_ID } from '../role.constant'

@ApiModel(
  {
    name: { type: String, description: ROLE_NAME, example: '超级管理员' },
    roleCode: { type: String, description: ROLE_CODE, example: 'SUPER' },
    parentId: { type: String, description: ROLE_PARENT_ID, example: 'xxx' },
    remark: { type: String, description: REMARK, example: '张三创建' },
  },
  { description: '创建角色接口参数校验' },
)
export class CreateRoleDTO implements ICreateRoleDTO {
  @NotEmpty(ROLE_NAME)
  @InputSpace(ROLE_NAME)
  @InputStringLength(ROLE_NAME_MIN, ROLE_NAME_MAX, ROLE_NAME)
  name: string

  @NotEmpty(ROLE_CODE)
  @InputSpace(ROLE_CODE)
  @InputStringLength(ROLE_CODE_MIN, ROLE_CODE_MAX, ROLE_CODE)
  roleCode: string

  @InputSpace(ROLE_PARENT_ID)
  @InputStringLength(UUID_V4_LENGTH, UUID_V4_LENGTH, ROLE_PARENT_ID)
  @IsOptional()
  parentId?: string

  @InputSpace(REMARK)
  @InputStringLength(REMARK_MIN, REMARK_MAX, REMARK)
  @IsOptional()
  remark?: string
}
