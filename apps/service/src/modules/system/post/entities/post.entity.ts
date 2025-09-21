import type { IPostEntity } from '../IPost'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import { UserEntity } from '@/modules/system/user/entities/user.entity'

@Entity({ name: 'sys_post', comment: '岗位表' })
export class PostEntity extends CommonEntity implements IPostEntity {
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

  // @Index('IDX_POST_SORT_ORDER', ['sort_order'])
  // @Column({
  //   comment: '显示顺序',
  //   name: 'sort_order',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: SortOrderEnum.HIGH_PRIORITY,
  // })
  // sortOrder: SortOrderEnum

  @OneToMany(() => UserEntity, (user) => user.post)
  users: UserEntity[]

  @ManyToOne(() => DeptEntity, (dept) => dept.posts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinColumn({
    name: 'dept_id',
    referencedColumnName: 'id',
  })
  dept: DeptEntity | null
}
