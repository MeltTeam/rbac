import type { AuthDetailsVO, FindAllAuthVO, MeInfoVO, ResVO, SvgCaptchaVO, TokenVO } from '../../common.type'

export interface CreateAuthResponses {
  200: ResVO & {
    data?: AuthDetailsVO
  }
}

export interface DeleteAuthResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface EmailCaptchaResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface EmailLoginResponses {
  200: ResVO & {
    data?: TokenVO
  }
}

export interface EmailRegisterResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface EmailResetPwdResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface GetAuthByIdResponses {
  200: ResVO & {
    data?: AuthDetailsVO
  }
}

export interface GetAuthsResponses {
  200: ResVO & {
    data?: FindAllAuthVO
  }
}

export interface GetMeInfoResponses {
  200: ResVO & {
    data?: MeInfoVO
  }
}

export interface LoginOutResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface RefreshTokenResponses {
  200: ResVO & {
    data?: TokenVO
  }
}

export interface SvgCaptchaResponses {
  200: ResVO & {
    data?: SvgCaptchaVO
  }
}

export interface SvgLoginResponses {
  200: ResVO & {
    data?: TokenVO
  }
}

export interface UpdateAuthResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateAuthSortResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface UpdateAuthStatusResponses {
  200: ResVO & {
    data?: unknown
  }
}
