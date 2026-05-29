import type { IReplaceRoleMenuDTO } from '@packages/types'
import { ApiSchema } from '@nestjs/swagger'
import { InputArray, InputSpace, Length, NotEmpty } from '@/common/deco'
import { MENU_ID } from '@/modules/rbac/menu/domain'
import { RoleIdDTO } from './role-id.dto'

/** 替换角色的菜单(全量替换)参数校验 */
@ApiSchema({ description: '替换角色的菜单(全量替换)参数校验' })
export class ReplaceRoleMenuDTO extends RoleIdDTO implements IReplaceRoleMenuDTO {
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
