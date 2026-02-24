import type { FindAllRoleVO, ResVO, RoleDetailsVO, RoleTreeVO } from '../../common.type'

export interface V1RoleGetResponses {
  200: ResVO & {
    data?: FindAllRoleVO
  }
}

export interface V1RoleIdDeleteResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RoleIdGetResponses {
  200: ResVO & {
    data?: RoleDetailsVO
  }
}

export interface V1RoleIdMovePatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RoleIdPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RoleIdSortPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RoleIdStatusPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1RolePostResponses {
  200: ResVO & {
    data?: RoleDetailsVO
  }
}

export interface V1RoleTreeIdGetResponses {
  200: ResVO & {
    data?: RoleTreeVO
  }
}

export interface V1RoleTreesPostResponses {
  200: ResVO & {
    data?: RoleTreeVO[]
  }
}
