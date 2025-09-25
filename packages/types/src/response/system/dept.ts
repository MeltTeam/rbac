import type { StatusEnum } from '../../enums'
import type { IFindAllVO } from '../common'

/** 部门详情 */
export interface IDeptVO {
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
  /** 父部门ID */
  parentId: string | null
  /** 部门名 */
  name: string
  /** 部门负责人ID */
  leaderId: string
  /** 部门邮箱 */
  email: string | null
  /** 部门电话 */
  phone: string | null
  /** 部门编码 */
  deptCode: string
}

/** 分页查询部门详情列表 */
export interface IFindAllDeptVO extends IFindAllVO<IDeptVO> {}
