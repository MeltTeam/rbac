import type { IPostEntity } from '../IPost'
import { CommonEntity } from '@entities/common.entity'
import { SortOrderEnum } from '@packages/types'
import { UserEntity } from '@user/entities/user.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

/** 岗位表实体 */
@Entity({ name: 'sys_post', comment: '岗位表' })
export class PostEntity extends CommonEntity implements IPostEntity {
  constructor() {
    super()
  }

  @Column({
    comment: '岗位名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '岗位编码',
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  code: string

  @Index('IDX_POST_SORT_ORDER', ['sort_order'])
  @Column({
    comment: '显示顺序',
    name: 'sort_order',
    type: 'tinyint',
    unsigned: true,
    default: SortOrderEnum.HIGH_PRIORITY,
  })
  sortOrder: SortOrderEnum

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity
}
