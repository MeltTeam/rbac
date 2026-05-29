import type { IReplaceRolesResourceDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { RESOURCE_ID } from '@/modules/rbac/resource/domain'
import { RoleIdsDTO } from './role-ids.dto'

/** 批量替换角色的资源(全量替换)参数校验 */
@ApiSchema({ description: '批量替换角色的资源(全量替换)参数校验' })
export class ReplaceRolesResourceDTO extends RoleIdsDTO implements IReplaceRolesResourceDTO {
  /**
   * 资源ID列表
   * @example ['xxx', 'xxx']
   */
  @Length(36, 36, RESOURCE_ID, true)
  @InputSpace(RESOURCE_ID, true)
  @NotEmpty(RESOURCE_ID, true)
  @InputArray(RESOURCE_ID)
  resourceIds: string[]
}
