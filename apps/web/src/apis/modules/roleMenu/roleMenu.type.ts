import type { MenuIdsVO, ResVO, RoleIdsVO } from '../../common.type'

export interface V1RoleMenuBatchPostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RoleMenuIdMenuidsGetResponses {
  200: ResVO & {
    data?: MenuIdsVO
  }
}

export interface V1RoleMenuIdRoleidsGetResponses {
  200: ResVO & {
    data?: RoleIdsVO
  }
}

export interface V1RoleMenuPostResponses {
  200: ResVO & {
    data?: unknown
  }
}
