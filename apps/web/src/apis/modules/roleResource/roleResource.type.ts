import type { ResourceIdsVO, ResVO, RoleIdsVO } from '../../common.type'

export interface V1RoleResourceBatchPostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RoleResourceIdResourceidsGetResponses {
  200: ResVO & {
    data?: ResourceIdsVO
  }
}

export interface V1RoleResourceIdRoleidsGetResponses {
  200: ResVO & {
    data?: RoleIdsVO
  }
}

export interface V1RoleResourcePostResponses {
  200: ResVO & {
    data?: unknown
  }
}
