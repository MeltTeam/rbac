import type { FindAllMenuVO, MenuDetailsVO, MenuTreeVO, ResVO } from '../../common.type'

export interface V1MenuGetResponses {
  200: ResVO & {
    data?: FindAllMenuVO
  }
}

export interface V1MenuIdDeleteResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1MenuIdGetResponses {
  200: ResVO & {
    data?: MenuDetailsVO
  }
}

export interface V1MenuIdMovePatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1MenuIdPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1MenuIdSortPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1MenuIdStatusPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1MenuPostResponses {
  200: ResVO & {
    data?: MenuDetailsVO
  }
}

export interface V1MenuTreeIdGetResponses {
  200: ResVO & {
    data?: MenuTreeVO
  }
}

export interface V1MenuTreesPostResponses {
  200: ResVO & {
    data?: MenuTreeVO[]
  }
}
