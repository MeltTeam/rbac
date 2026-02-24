import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取认证列表 GET /v1/auth */
export function v1AuthGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthGetParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.V1AuthGetParams,
    API.ResVO & {
      data?: API.FindAllAuthVO
    }
  >('/v1/auth', {
    method: 'GET',
    params: {
      ...params,
    },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 创建认证 POST /v1/auth */
export function v1AuthPost({
  body,
  options,
}: {
  body: API.CreateAuthDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.CreateAuthDTO,
    API.ResVO & {
      data?: API.AuthDetailsVO
    }
  >('/v1/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 查看单个认证详情 GET /v1/auth/${param0} */
export function v1AuthIdGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthIdGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1AuthIdGetParams,
    API.ResVO & {
      data?: API.AuthDetailsVO
    }
  >(`/v1/auth/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 删除认证 DELETE /v1/auth/${param0} */
export function v1AuthIdDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthIdDeleteParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.V1AuthIdDeleteParams,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/auth/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新认证 PATCH /v1/auth/${param0} */
export function v1AuthIdPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthIdPatchParams
  body: API.UpdateAuthDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateAuthDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/auth/${param0}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新认证排序优先级 PATCH /v1/auth/${param0}/sort */
export function v1AuthIdSortPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthIdSortPatchParams
  body: API.UpdateSortDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateSortDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/auth/${param0}/sort`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 更新认证状态 PATCH /v1/auth/${param0}/status */
export function v1AuthIdStatusPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthIdStatusPatchParams
  body: API.UpdateStatusDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.UpdateStatusDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/auth/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 发送邮件验证码 POST /v1/auth/email/${param0} */
export function v1AuthEmailNamePost({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthEmailNamePostParams
  body: API.EmailCaptchaDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { name: param0, ...queryParams } = params

  return http.request<
    API.EmailCaptchaDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/auth/email/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 邮箱登录 POST /v1/auth/login/email */
export function v1AuthLoginEmailPost({
  body,
  options,
}: {
  body: API.EmailLoginDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.EmailLoginDTO,
    API.ResVO & {
      data?: API.TokenVO
    }
  >('/v1/auth/login/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** SVG登录 POST /v1/auth/login/svg */
export function v1AuthLoginSvgPost({
  body,
  options,
}: {
  body: API.SvgLoginDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.SvgLoginDTO,
    API.ResVO & {
      data?: API.TokenVO
    }
  >('/v1/auth/login/svg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 登出 POST /v1/auth/logout */
export function v1AuthLogoutPost({
  body,
  options,
}: {
  body: API.RefreshTokenDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.RefreshTokenDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取当前登录用户信息 GET /v1/auth/me */
export function v1AuthMeGet({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<
    any,
    API.ResVO & {
      data?: API.UserDetailsVO
    }
  >('/v1/auth/me', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 刷新令牌 POST /v1/auth/refresh */
export function v1AuthRefreshPost({
  body,
  options,
}: {
  body: API.RefreshTokenDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.RefreshTokenDTO,
    API.ResVO & {
      data?: API.TokenVO
    }
  >('/v1/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 邮箱注册 POST /v1/auth/register/email */
export function v1AuthRegisterEmailPost({
  body,
  options,
}: {
  body: API.EmailRegisterDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.EmailRegisterDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/auth/register/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 邮箱重置密码 POST /v1/auth/reset-pwd/email */
export function v1AuthResetpwdEmailPost({
  body,
  options,
}: {
  body: API.EmailResetPwdDTO

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.EmailResetPwdDTO,
    API.ResVO & {
      data?: unknown
    }
  >('/v1/auth/reset-pwd/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 获取SVG验证码 GET /v1/auth/svg/${param0} */
export function v1AuthSvgNameGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.V1AuthSvgNameGetParams

  options?: ICustomAxiosRequestConfig
}) {
  const { name: param0, ...queryParams } = params

  return http.request<
    API.V1AuthSvgNameGetParams,
    API.ResVO & {
      data?: API.SvgCaptchaVO
    }
  >(`/v1/auth/svg/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}
