import type { FindAllRoleVO, ResVO, RoleDetailsVO, RoleTreeVO } from '../../common.type'

export interface CreateRoleResponses {
  200: ResVO & {
    data?: RoleDetailsVO
  }
}

export interface DeleteRoleResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface GetRoleByIdResponses {
  200: ResVO & {
    data?: RoleDetailsVO
  }
}

export interface GetRolesResponses {
  200: ResVO & {
    data?: FindAllRoleVO
  }
}

export interface GetRoleTreeResponses {
  200: ResVO & {
    data?: RoleTreeVO
  }
}

export interface GetRoleTreesResponses {
  200: ResVO & {
    data?: RoleTreeVO[]
  }
}

export interface MoveRoleResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateRoleResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateRoleSortResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateRoleStatusResponses {
  200: ResVO & {
    data?: unknown
  }
}
