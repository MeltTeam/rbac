// import type { SortOrderEnum } from '@packages/types'
import type { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
// import type { UserEntity } from '@/modules/system/user/entities/user.entity'

/** 岗位表实体接口 */
export interface IPostEntity {
  /** 岗位名 */
  name: string
  /** 岗位编码 */
  postCode: string
  /** 显示顺序(10:高 20:中 30:低 默认:10) */
  // sortOrder: SortOrderEnum
  /** 岗位N-1部门 */
  dept: DeptEntity | null
  /** 岗位1-N用户 */
  // users: UserEntity[]
}

/** 岗位模块服务接口 */
export interface IPostService {}

/** 岗位模块控制器接口 */
export interface IPostController {}
