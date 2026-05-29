import type { IReplaceRolesMenuDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { MENU_ID } from '@/modules/rbac/menu/domain'
import { RoleIdsDTO } from './role-ids.dto'

/** 批量替换角色的菜单(全量替换)参数校验 */
@ApiSchema({ description: '批量替换角色的菜单(全量替换)参数校验' })
export class ReplaceRolesMenuDTO extends RoleIdsDTO implements IReplaceRolesMenuDTO {
  /**
   * 菜单ID列表
   * @example ['xxx', 'xxx']
   */
  @Length(36, 36, MENU_ID, true)
  @InputSpace(MENU_ID, true)
  @NotEmpty(MENU_ID, true)
  @InputArray(MENU_ID)
  menuIds: string[]
}
