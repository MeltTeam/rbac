import type { FindAllUserVO, ResVO, UserDetailsVO } from '../../common.type'

export interface V1UserGetResponses {
  200: ResVO & {
    data?: FindAllUserVO
  }
}

export interface V1UserIdDeleteResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1UserIdGetResponses {
  200: ResVO & {
    data?: UserDetailsVO
  }
}

export interface V1UserIdPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1UserIdSortPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1UserIdStatusPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1UserPostResponses {
  200: ResVO & {
    data?: UserDetailsVO
  }
}
