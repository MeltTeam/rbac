import type { FindAllResourceVO, ResourceDetailsVO, ResVO } from '../../common.type'

export interface V1ResourceGetResponses {
  200: ResVO & {
    data?: FindAllResourceVO
  }
}

export interface V1ResourceIdDeleteResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1ResourceIdGetResponses {
  200: ResVO & {
    data?: ResourceDetailsVO
  }
}

export interface V1ResourceIdPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1ResourceIdSortPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1ResourceIdStatusPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1ResourcePostResponses {
  200: ResVO & {
    data?: ResourceDetailsVO
  }
}
