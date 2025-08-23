/** 应用进程ID */
export const APP_PID = process.pid
/** 数据库没有库存时给redis的值 */
export const DB_NULL = 'N'
/** UUID v4 长度 */
export const UUID_V4_LENGTH = 36
/** 系统默认操作者 */
export const SYSTEM_DEFAULT_BY = 'system'
/** 系统默认备注 */
export const SYSTEM_DEFAULT_REMARK = SYSTEM_DEFAULT_BY
/** 系统异常消息 */
export const SYSTEM_EXCEPTION_MSG = '系统异常，请稍后重试或者联系系统管理员'
// 备注相关
/** 备注 key */
export const REMARK = '备注'
/** 备注最小长度 */
export const REMARK_MIN = 1
/** 备注最大长度 */
export const REMARK_MAX = 500

// 邮箱相关
/** 邮箱 key */
export const EMAIL = '邮箱'

// 密码相关
/** 确认密码 key */
export const CONFIRM_PWD = '确认密码'
/** 密码 key */
export const PWD = '密码'
/** 密码最小长度 */
export const PWD_MIN = 8
/** 密码最大长度 */
export const PWD_MAX = 64

// 验证码相关
/** 验证码 key */
export const CAPTCHA = '验证码'
/** 验证码长度 */
export const CAPTCHA_LENGTH = 6
/** 验证码凭证 key */
export const CAPTCHA_TOKEN = '验证码凭证'
/** 验证码凭证长度 */
export const CAPTCHA_TOKEN_LENGTH = UUID_V4_LENGTH

// token相关
/** 刷新令牌 key */
export const REFRESH_TOKEN = '刷新令牌'
