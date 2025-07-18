/** 应用进程ID */
export const APP_PID = process.pid
/** 数据库没有库存时给redis的值 */
export const DB_NULL = 'N'
/** UUID v4 长度 */
export const UUID_V4_LENGTH = 36

// 用户相关
/** 用户别名 key */
export const NICK_NAME = '别名'
/** 用户ID key */
export const USER_ID = '用户ID'
/** 用户名 key */
export const USER_NAME = '用户名'
/** 用户名最小长度 */
export const USER_NAME_MIN = 2
/** 用户名最大长度 */
export const USER_NAME_MAX = 64

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
