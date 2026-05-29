/** 替换用户的岗位(全量替换)接口参数校验  */
export interface IReplaceUserPostDTO {
  /** 用户ID */
  id: string
  /** 岗位ID */
  postIds: string
}

/** 批量替换用户的岗位(全量替换)接口参数校验  */
export interface IReplaceUsersPostDTO {
  /** 用户ID列表 */
  ids: string[]
  /** 岗位ID */
  postId: string
}
