export interface ISystemExceptionOptions {
  /** 异常对象 */
  error: unknown
}
/** 系统异常 */
export class SystemException extends Error {
  constructor(options: ISystemExceptionOptions) {
    const { error } = options
    super((error as Error).message)
  }
}
