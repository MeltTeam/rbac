/**
 * HTTP 状态码
 */
export enum HttpStatus {
  /** 继续 */
  CONTINUE = 100,
  /** 切换协议 */
  SWITCHING_PROTOCOLS = 101,
  /** 处理中 */
  PROCESSING = 102,
  /** 提前通知 */
  EARLYHINTS = 103,
  /** 成功 */
  OK = 200,
  /** 已创建 */
  CREATED = 201,
  /** 已接受 */
  ACCEPTED = 202,
  /** 非权威信息 */
  NON_AUTHORITATIVE_INFORMATION = 203,
  /** 无内容 */
  NO_CONTENT = 204,
  /** 重置内容 */
  RESET_CONTENT = 205,
  /** 部分内容 */
  PARTIAL_CONTENT = 206,
  /** 多种选择 */
  AMBIGUOUS = 300,
  /** 永久移动 */
  MOVED_PERMANENTLY = 301,
  /** 临时移动 */
  FOUND = 302,
  /** 查看其他 */
  SEE_OTHER = 303,
  /** 未修改 */
  NOT_MODIFIED = 304,
  /** 临时重定向 */
  TEMPORARY_REDIRECT = 307,
  /** 永久重定向 */
  PERMANENT_REDIRECT = 308,
  /** 错误请求 */
  BAD_REQUEST = 400,
  /** 未授权 */
  UNAUTHORIZED = 401,
  /** 需要付款 */
  PAYMENT_REQUIRED = 402,
  /** 禁止 */
  FORBIDDEN = 403,
  /** 未找到 */
  NOT_FOUND = 404,
  /** 方法不允许 */
  METHOD_NOT_ALLOWED = 405,
  /** 不可接受 */
  NOT_ACCEPTABLE = 406,
  /** 需要代理身份验证 */
  PROXY_AUTHENTICATION_REQUIRED = 407,
  /** 请求超时 */
  REQUEST_TIMEOUT = 408,
  /** 冲突 */
  CONFLICT = 409,
  /** 已删除 */
  GONE = 410,
  /** 需要请求长度 */
  LENGTH_REQUIRED = 411,
  /** 前置条件失败 */
  PRECONDITION_FAILED = 412,
  /** 负载过大 */
  PAYLOAD_TOO_LARGE = 413,
  /** URI 过长 */
  URI_TOO_LONG = 414,
  /** 不支持的媒体类型 */
  UNSUPPORTED_MEDIA_TYPE = 415,
  /** 请求范围不符合 */
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  /** 期望失败 */
  EXPECTATION_FAILED = 417,
  /** 我是一个茶壶 */
  I_AM_A_TEAPOT = 418,
  /** 错误的路由 */
  MISDIRECTED = 421,
  /** 无法处理 */
  UNPROCESSABLE_ENTITY = 422,
  /** 依赖失败 */
  FAILED_DEPENDENCY = 424,
  /** 前置条件需要 */
  PRECONDITION_REQUIRED = 428,
  /** 请求过多 */
  TOO_MANY_REQUESTS = 429,
  /** 内部服务器错误 */
  INTERNAL_SERVER_ERROR = 500,
  /** 未实现 */
  NOT_IMPLEMENTED = 501,
  /** 错误的网关 */
  BAD_GATEWAY = 502,
  /** 服务不可用 */
  SERVICE_UNAVAILABLE = 503,
  /** 网关超时 */
  GATEWAY_TIMEOUT = 504,
  /** HTTP 版本不支持 */
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

/** HTTP 状态码文本映射 */
export const HttpStatusTextMap: Record<HttpStatus, string> = {
  [HttpStatus.CONTINUE]: '继续',
  [HttpStatus.SWITCHING_PROTOCOLS]: '切换协议',
  [HttpStatus.PROCESSING]: '处理中',
  [HttpStatus.EARLYHINTS]: '提前通知',
  [HttpStatus.OK]: '成功',
  [HttpStatus.CREATED]: '已创建',
  [HttpStatus.ACCEPTED]: '已接受',
  [HttpStatus.NON_AUTHORITATIVE_INFORMATION]: '非权威信息',
  [HttpStatus.NO_CONTENT]: '无内容',
  [HttpStatus.RESET_CONTENT]: '重置内容',
  [HttpStatus.PARTIAL_CONTENT]: '部分内容',
  [HttpStatus.AMBIGUOUS]: '多种选择',
  [HttpStatus.MOVED_PERMANENTLY]: '永久移动',
  [HttpStatus.FOUND]: '临时移动',
  [HttpStatus.SEE_OTHER]: '查看其他',
  [HttpStatus.NOT_MODIFIED]: '未修改',
  [HttpStatus.TEMPORARY_REDIRECT]: '临时重定向',
  [HttpStatus.PERMANENT_REDIRECT]: '永久重定向',
  [HttpStatus.BAD_REQUEST]: '错误请求',
  [HttpStatus.UNAUTHORIZED]: '未授权',
  [HttpStatus.PAYMENT_REQUIRED]: '需要付款',
  [HttpStatus.FORBIDDEN]: '禁止',
  [HttpStatus.NOT_FOUND]: '未找到',
  [HttpStatus.METHOD_NOT_ALLOWED]: '方法不允许',
  [HttpStatus.NOT_ACCEPTABLE]: '不可接受',
  [HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: '需要代理身份验证',
  [HttpStatus.REQUEST_TIMEOUT]: '请求超时',
  [HttpStatus.CONFLICT]: '冲突',
  [HttpStatus.GONE]: '已删除',
  [HttpStatus.LENGTH_REQUIRED]: '需要请求长度',
  [HttpStatus.PRECONDITION_FAILED]: '前置条件失败',
  [HttpStatus.PAYLOAD_TOO_LARGE]: '负载过大',
  [HttpStatus.URI_TOO_LONG]: 'URI 过长',
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: '不支持的媒体类型',
  [HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: '请求范围不符合',
  [HttpStatus.EXPECTATION_FAILED]: '期望失败',
  [HttpStatus.I_AM_A_TEAPOT]: '我是一个茶壶',
  [HttpStatus.MISDIRECTED]: '错误的路由',
  [HttpStatus.UNPROCESSABLE_ENTITY]: '无法处理',
  [HttpStatus.FAILED_DEPENDENCY]: '依赖失败',
  [HttpStatus.PRECONDITION_REQUIRED]: '前置条件需要',
  [HttpStatus.TOO_MANY_REQUESTS]: '请求过多',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '内部服务器错误',
  [HttpStatus.NOT_IMPLEMENTED]: '未实现',
  [HttpStatus.BAD_GATEWAY]: '错误的网关',
  [HttpStatus.SERVICE_UNAVAILABLE]: '服务不可用',
  [HttpStatus.GATEWAY_TIMEOUT]: '网关超时',
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: 'HTTP 版本不支持',
}
