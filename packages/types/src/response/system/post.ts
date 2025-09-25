import type { StatusEnum } from '../../enums'
import type { IFindAllVO } from '../common'
import type { IDeptVO } from './dept'
/** 岗位详情 */
export interface IPostVO {
  /** 业务ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 备注 */
  remark: string | null
  /** 状态 */
  status: StatusEnum
  /** 岗位名 */
  name: string
  /** 岗位编码 */
  postCode: string
  /** 岗位部门 */
  dept: IDeptVO | null
}

/** 分页查询岗位详情列表 */
export interface IFindAllPostVO extends IFindAllVO<IPostVO> {}
