import type { AddVo } from './add.vo'

export class FindAllVo {
  data: AddVo[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}
