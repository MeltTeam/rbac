import type { AuthDetailsVO, FindAllAuthVO, ResVO, SvgCaptchaVO, TokenVO, UserDetailsVO } from '../../common.type'

export interface V1AuthEmailNamePostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthGetResponses {
  200: ResVO & {
    data?: FindAllAuthVO
  }
}

export interface V1AuthIdDeleteResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthIdGetResponses {
  200: ResVO & {
    data?: AuthDetailsVO
  }
}

export interface V1AuthIdPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthIdSortPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthIdStatusPatchResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthLoginEmailPostResponses {
  200: ResVO & {
    data?: TokenVO
  }
}

export interface V1AuthLoginSvgPostResponses {
  200: ResVO & {
    data?: TokenVO
  }
}

export interface V1AuthLogoutPostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthMeGetResponses {
  200: ResVO & {
    data?: UserDetailsVO
  }
}

export interface V1AuthPostResponses {
  200: ResVO & {
    data?: AuthDetailsVO
  }
}

export interface V1AuthRefreshPostResponses {
  200: ResVO & {
    data?: TokenVO
  }
}

export interface V1AuthRegisterEmailPostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthResetpwdEmailPostResponses {
  200: ResVO & {
    data?: unknown
  }
}

export interface V1AuthSvgNameGetResponses {
  200: ResVO & {
    data?: SvgCaptchaVO
  }
}
