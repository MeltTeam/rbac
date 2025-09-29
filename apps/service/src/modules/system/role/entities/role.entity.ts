import type { IRoleEntity } from '../IRole'
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { UUID_V4_LENGTH } from '@/common/constants'
import { CommonEntity } from '@/common/entities/common.entity'
import { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import { UserEntity } from '@/modules/system/user/entities/user.entity'
import { ROLE_CODE, ROLE_CODE_MAX, ROLE_NAME, ROLE_NAME_MAX, ROLE_PARENT_ID, SYS_ROLE_DEPT, SYS_ROLE_PERMISSION } from '../role.constant'
import { RoleTreeEntity } from './roleTree.entity'

@Entity({ name: 'sys_role', comment: '角色表' })
@Index(['name', 'roleCode'], { unique: true })
export class RoleEntity extends CommonEntity implements IRoleEntity {
  @Column({
    comment: ROLE_PARENT_ID,
    name: 'parent_id',
    type: 'varchar',
    length: UUID_V4_LENGTH,
    charset: 'ascii',
    nullable: true,
  })
  parentId: string | null

  @Column({
    comment: ROLE_NAME,
    name: 'name',
    type: 'varchar',
    length: ROLE_NAME_MAX,
    unique: true,
  })
  name: string

  @Column({
    comment: ROLE_CODE,
    name: 'role_code',
    type: 'varchar',
    length: ROLE_CODE_MAX,
    unique: true,
  })
  roleCode: string

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
    name: SYS_ROLE_PERMISSION,
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
    name: SYS_ROLE_DEPT,
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'dept_id', referencedColumnName: 'id' }],
  })
  depts: DeptEntity[]

  @OneToMany(() => RoleTreeEntity, (node) => node.descendantRole)
  ancestorNodes: RoleTreeEntity[]

  @OneToMany(() => RoleTreeEntity, (node) => node.ancestorRole)
  descendantNodes: RoleTreeEntity[]
}
