import type * as API from '../../types'
import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils'

import { http } from '@/utils/http'

/** 获取认证列表 getAuths GET /v1/auth */
export function getAuths({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetAuthsParams

  options?: ICustomAxiosRequestConfig
}) {
  return http.request<
    API.GetAuthsParams,
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

/** 创建认证 createAuth POST /v1/auth */
export function createAuth({
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

/** 查看单个认证详情 getAuthById GET /v1/auth/${param0} */
export function getAuthById({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.GetAuthByIdParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.GetAuthByIdParams,
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

/** 删除认证 deleteAuth DELETE /v1/auth/${param0} */
export function deleteAuth({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.DeleteAuthParams

  options?: ICustomAxiosRequestConfig
}) {
  const { id: param0, ...queryParams } = params

  return http.request<
    API.DeleteAuthParams,
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

/** 更新认证 updateAuth PATCH /v1/auth/${param0} */
export function updateAuth({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateAuthParams
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

/** 更新认证排序优先级 updateAuthSort PATCH /v1/auth/${param0}/sort */
export function updateAuthSort({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateAuthSortParams
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

/** 更新认证状态 updateAuthStatus PATCH /v1/auth/${param0}/status */
export function updateAuthStatus({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.UpdateAuthStatusParams
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

/** 发送邮件验证码 emailCaptcha POST /v1/auth/captcha/email/${param0} */
export function emailCaptcha({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.EmailCaptchaParams
  body: API.EmailCaptchaDTO

  options?: ICustomAxiosRequestConfig
}) {
  const { name: param0, ...queryParams } = params

  return http.request<
    API.EmailCaptchaDTO,
    API.ResVO & {
      data?: unknown
    }
  >(`/v1/auth/captcha/email/${param0}`, {
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

/** 获取SVG验证码 svgCaptcha GET /v1/auth/captcha/svg/${param0} */
export function svgCaptcha({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SvgCaptchaParams

  options?: ICustomAxiosRequestConfig
}) {
  const { name: param0, ...queryParams } = params

  return http.request<
    API.SvgCaptchaParams,
    API.ResVO & {
      data?: API.SvgCaptchaVO
    }
  >(`/v1/auth/captcha/svg/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 邮箱登录 emailLogin POST /v1/auth/login/email */
export function emailLogin({
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

/** SVG登录 svgLogin POST /v1/auth/login/svg */
export function svgLogin({
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

/** 登出 loginOut POST /v1/auth/logout */
export function loginOut({
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

/** 获取当前登录用户信息 getMeInfo GET /v1/auth/me */
export function getMeInfo({ options }: { options?: ICustomAxiosRequestConfig }) {
  return http.request<
    any,
    API.ResVO & {
      data?: API.MeInfoVO
    }
  >('/v1/auth/me', {
    method: 'GET',
    // 配置插件之类的
    ...(options || {
      customConfig: {},
    }),
  })
}

/** 刷新令牌 refreshToken POST /v1/auth/refresh */
export function refreshToken({
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

/** 邮箱注册 emailRegister POST /v1/auth/register/email */
export function emailRegister({
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

/** 邮箱重置密码 emailResetPwd POST /v1/auth/reset-pwd/email */
export function emailResetPwd({
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
