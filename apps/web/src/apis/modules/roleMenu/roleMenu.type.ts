import type { MenuIdsVO, ResVO, RoleIdsVO } from '../../common.type'

export interface GetMenuByRoleResponses {
  200: ResVO & {
    data?: MenuIdsVO
  }
}

export interface GetRoleByMenuResponses {
  200: ResVO & {
    data?: RoleIdsVO
  }
}

export interface ReplaceRoleMenuResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface ReplaceRolesMenuResponses {
  200: ResVO & {
    data?: unknown
  }
}
