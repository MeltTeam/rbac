import type { StatusEnum } from '../enums'

/** 对id参数校验 */
export interface IIdDTO {
  /** 业务ID */
  id: string
}

/** 对name参数校验 */
export interface INameDTO {
  /** 名字 */
  name: string
}

/** 更新状态接口参数校验 */
export interface IUpdateStatusDTO {
  /** 状态 */
  status: StatusEnum
}
