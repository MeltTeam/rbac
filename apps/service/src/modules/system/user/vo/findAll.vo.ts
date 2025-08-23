import type { UserVO } from './index'

export class FindAllVO {
  data: UserVO[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}
