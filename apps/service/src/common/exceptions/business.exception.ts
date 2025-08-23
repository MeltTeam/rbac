import { HttpException } from '@nestjs/common'

/** 业务错误类型 */
export class BusinessException extends HttpException {}
