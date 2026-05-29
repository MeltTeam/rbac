import type { ResourceIdsVO, ResVO, RoleIdsVO } from '../../common.type'

export interface GetResourceByRoleResponses {
  200: ResVO & {
    data?: ResourceIdsVO
  }
}

export interface GetRoleByResourceResponses {
  200: ResVO & {
    data?: RoleIdsVO
  }
}

export interface ReplaceRoleResourceResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface ReplaceRolesResourceResponses {
  200: ResVO & {
    data?: unknown
  }
}
