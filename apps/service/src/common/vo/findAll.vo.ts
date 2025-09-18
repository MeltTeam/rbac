export interface IFindAllVOOptions<T = any> {
  /** 数据的构造函数 */
  DataConstructor: new (...args: any[]) => T
  /** 数据列表 */
  data: T[]
  /** 一页几条数据 */
  limit: number
  /** 第几页 */
  page: number
  /** 总数 */
  total: number
}
export class FindAllVO<T = any> {
  /** 数据列表 */
  data: T[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
  constructor(findAllVOOptions?: IFindAllVOOptions<T>) {
    if (findAllVOOptions) {
      const { DataConstructor, data, limit, page, total } = findAllVOOptions
      this.data = data.map((data) => new DataConstructor(data))
      this.limit = limit
      this.page = page
      this.total = total
      this.totalPages = Math.ceil(total / limit)
    }
  }
}
