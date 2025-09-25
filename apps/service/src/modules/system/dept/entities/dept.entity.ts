import type { IDeptEntity } from '../IDept'
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { PostEntity } from '@/modules/system/post/entities/post.entity'
import { RoleEntity } from '@/modules/system/role/entities/role.entity'
import { DeptTreeEntity } from './deptTree.entity'

@Entity({ name: 'sys_dept', comment: '部门表' })
@Index(['name', 'deptCode', 'email', 'phone'], { unique: true })
export class DeptEntity extends CommonEntity implements IDeptEntity {
  @Column({
    comment: '父部门ID',
    name: 'parent_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    nullable: true,
  })
  parentId: string | null

  @Column({
    comment: '部门名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '部门编码',
    name: 'dept_code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  deptCode: string

  @Column({
    comment: '部门负责人ID',
    name: 'leader_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  leaderId: string

  @Column({
    comment: '部门邮箱',
    name: 'email',
    type: 'varchar',
    length: 254,
    unique: true,
    nullable: true,
    default: null,
  })
  email: string | null

  @Column({
    comment: '部门电话',
    name: 'phone',
    type: 'varchar',
    length: 11,
    unique: true,
    nullable: true,
    default: null,
  })
  phone: string | null

  @OneToMany(() => PostEntity, (post) => post.dept)
  posts: PostEntity[]

  @ManyToMany(() => RoleEntity, (role) => role.depts)
  roles: RoleEntity[]

  @OneToMany(() => DeptTreeEntity, (node) => node.descendantDept)
  ancestorNodes: DeptTreeEntity[]

  @OneToMany(() => DeptTreeEntity, (node) => node.ancestorDept)
  descendantNodes: DeptTreeEntity[]
}
