import type { IPostEntity } from '../interfaces/IPostEntity'
import { SortOrderEnum } from '@packages/types'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { UserEntity } from '@/modules/user/entities/user.entity'

/** 岗位表实体 */
@Entity({ name: 'post', comment: '岗位表' })
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
