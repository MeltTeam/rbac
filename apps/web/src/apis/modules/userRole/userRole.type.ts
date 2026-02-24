import type { ResVO, RoleIdsVO, UserIdsVO } from '../../common.type'

export interface V1UserRoleBatchPostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1UserRoleIdRoleidsGetResponses {
  200: ResVO & {
    data?: RoleIdsVO
  }
}

export interface V1UserRoleIdUseridsGetResponses {
  200: ResVO & {
    data?: UserIdsVO
  }
}

export interface V1UserRolePostResponses {
  200: ResVO & {
    data?: unknown
  }
}
