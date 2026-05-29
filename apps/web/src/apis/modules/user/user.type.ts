import type { FindAllUserVO, ResVO, UserDetailsVO } from '../../common.type'

export interface CreateUserResponses {
  200: ResVO & {
    data?: UserDetailsVO
  }
}

export interface DeleteUserResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface GetUserByIdResponses {
  200: ResVO & {
    data?: UserDetailsVO
  }
}

export interface GetUsersResponses {
  200: ResVO & {
    data?: FindAllUserVO
  }
}

export interface UpdateUserResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateUserSortResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateUserStatusResponses {
  200: ResVO & {
    data?: unknown
  }
}
