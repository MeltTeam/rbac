import type { ResVO, RoleIdsVO, UserIdsVO } from '../../common.type'

export interface GetRoleByUserResponses {
  200: ResVO & {
    data?: RoleIdsVO
  }
}

export interface GetUserByRoleResponses {
  200: ResVO & {
    data?: UserIdsVO
  }
}

export interface ReplaceUserRoleResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface ReplaceUsersRoleResponses {
  200: ResVO & {
    data?: unknown
  }
}
