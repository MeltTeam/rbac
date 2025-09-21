// import type { IDeptEntity } from '../IDept'
// import { SortOrderEnum } from '@packages/types'
// import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm'
// import { CommonEntity } from '@/common/entities/common.entity'
// import { PostEntity } from '@/modules/system/post/entities/post.entity'
// import { RoleEntity } from '@/modules/system/role/entities/role.entity'

// @Entity({ name: 'sys_dept', comment: '部门表' })
// export class DeptEntity extends CommonEntity implements IDeptEntity {
//   @Column({
//     comment: '部门名',
//     name: 'name',
//     type: 'varchar',
//     length: 64,
//     unique: true,
//   })
//   name: string

//   @Index('IDX_DEPT_PARENT_ID', ['parent_id'])
//   @Column({
//     comment: '父级部门ID',
//     name: 'parent_id',
//     type: 'varchar',
//     length: 36,
//     charset: 'ascii',
//   })
//   parentId: string

//   @Column({
//     comment: '祖级列表',
//     name: 'ancestors',
//     type: 'text',
//     charset: 'utf8mb4',
//   })
//   ancestors: string

//   @Index('IDX_DEPT_LEADER_ID', ['leader_id'])
//   @Column({
//     comment: '部门负责人ID',
//     name: 'leader_id',
//     type: 'varchar',
//     length: 36,
//     charset: 'ascii',
//   })
//   leaderId: string

//   @Index('IDX_DEPT_EMAIL_ID', ['email'])
//   @Column({
//     comment: '部门邮箱',
//     name: 'email',
//     type: 'varchar',
//     length: 254,
//     unique: true,
//     nullable: true,
//     default: null,
//   })
//   email: string | null

//   @Column({
//     comment: '部门电话',
//     name: 'phone',
//     type: 'varchar',
//     length: 11,
//     unique: true,
//     nullable: true,
//     default: null,
//   })
//   phone: string | null

//   @Column({
//     comment: '部门编码',
//     name: 'code',
//     type: 'varchar',
//     length: 100,
//     unique: true,
//   })
//   code: string

//   @Index('IDX_DEPT_SORT_ORDER', ['sort_order'])
//   @Column({
//     comment: '显示顺序',
//     name: 'sort_order',
//     type: 'tinyint',
//     unsigned: true,
//     default: SortOrderEnum.HIGH_PRIORITY,
//   })
//   sortOrder: SortOrderEnum

//   @OneToMany(() => PostEntity, (post) => post.dept)
//   posts: PostEntity[]

//   @ManyToMany(() => RoleEntity, (role) => role.depts)
//   roles: RoleEntity[]
// }
