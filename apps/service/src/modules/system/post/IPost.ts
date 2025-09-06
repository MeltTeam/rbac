import type { SortOrderEnum } from '@packages/types'
import type { UserEntity } from '@/modules/system/user/entities/user.entity'

/** 岗位表实体接口 */
export interface IPostEntity {
  /** 岗位名 */
  name: string
  /** 岗位编码 */
  code: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  sortOrder: SortOrderEnum
  /** 岗位N-1用户 */
  user: UserEntity
}
