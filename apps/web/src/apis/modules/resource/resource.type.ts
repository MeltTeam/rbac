import type { FindAllResourceVO, ResourceDetailsVO, ResVO } from '../../common.type'

export interface CreateResourceResponses {
  200: ResVO & {
    data?: ResourceDetailsVO
  }
}

export interface DeleteResourceResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface GetResourceByIdResponses {
  200: ResVO & {
    data?: ResourceDetailsVO
  }
}

export interface GetResourcesResponses {
  200: ResVO & {
    data?: FindAllResourceVO
  }
}

export interface UpdateResourceResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateResourceSortResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateResourceStatusResponses {
  200: ResVO & {
    data?: unknown
  }
}
