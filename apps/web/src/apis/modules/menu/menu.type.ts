import type { FindAllMenuVO, MenuDetailsVO, MenuTreeVO, ResVO } from '../../common.type'

export interface CreateMenuResponses {
  200: ResVO & {
    data?: MenuDetailsVO
  }
}

export interface DeleteMenuResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface GetMenuByIdResponses {
  200: ResVO & {
    data?: MenuDetailsVO
  }
}

export interface GetMenusResponses {
  200: ResVO & {
    data?: FindAllMenuVO
  }
}

export interface GetMenuTreeResponses {
  200: ResVO & {
    data?: MenuTreeVO
  }
}

export interface GetMenuTreesResponses {
  200: ResVO & {
    data?: MenuTreeVO[]
  }
}

export interface MoveMenuResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateMenuResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateMenuSortResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateMenuStatusResponses {
  200: ResVO & {
    data?: unknown
  }
}
