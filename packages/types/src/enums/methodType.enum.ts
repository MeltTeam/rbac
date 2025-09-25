/** 请求类型枚举 */
export enum MethodTypeEnum {
  /** GET */
  GET = 10,
  /** POST */
  POST = 20,
  /** PUT */
  PUT = 30,
  /** DELETE */
  DELETE = 40,
  /** PATCH */
  PATCH = 50,
  /** HEAD */
  HEAD = 60,
  /** OPTIONS */
  OPTIONS = 70,
}

/** 请求类型枚举文本映射 */
export const MethodTypeTextMap: Record<MethodTypeEnum, string> = {
  [MethodTypeEnum.GET]: 'GET',
  [MethodTypeEnum.POST]: 'POST',
  [MethodTypeEnum.PUT]: 'PUT',
  [MethodTypeEnum.DELETE]: 'DELETE',
  [MethodTypeEnum.PATCH]: 'PATCH',
  [MethodTypeEnum.HEAD]: 'HEAD',
  [MethodTypeEnum.OPTIONS]: 'OPTIONS',
}
