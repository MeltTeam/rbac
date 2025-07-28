import type { IOKResponse, ISvgCaptchaVo } from '@packages/types'
import { request } from '@/utils/http.util'

/** svg验证码接口(登录) */
export async function loginBySvgCaptcha() {
  return (await request.get<ISvgCaptchaVo>(`/auth/login/captcha/svg`, undefined, {
    requestIdRules: 'method:url',
    limitTime: 3000,
    limitType: 'Throttle',
  })) as IOKResponse<ISvgCaptchaVo>
}
