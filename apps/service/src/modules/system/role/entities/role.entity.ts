import type { IRoleEntity } from '../IRole'
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import { UserEntity } from '@/modules/system/user/entities/user.entity'
import { RoleTreeEntity } from './roleTree.entity'

@Entity({ name: 'sys_role', comment: '角色表' })
export class RoleEntity extends CommonEntity implements IRoleEntity {
  @Column({
    comment: '父角色ID',
    name: 'parent_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    nullable: true,
  })
  parentId: string | null

  @Column({
    comment: '角色名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '角色编码',
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  code: string

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[]

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: 'sys_role_permission',
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
  })
  permissions: PermissionEntity[]

  @ManyToMany(() => DeptEntity, (dept) => dept.roles, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: 'sys_role_dept',
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'dept_id', referencedColumnName: 'id' }],
  })
  depts: DeptEntity[]

  @OneToMany(() => RoleTreeEntity, (node) => node.descendantRole)
  ancestorNodes: RoleTreeEntity[]

  @OneToMany(() => RoleTreeEntity, (node) => node.ancestorRole)
  descendantNodes: RoleTreeEntity[]
}
