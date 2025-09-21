// import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
// import { CommonEntity } from '@/common/entities/common.entity'
// import { DeptEntity } from '@/modules/system/dept/entities/dept.entity'
// import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
// import { UserEntity } from '@/modules/system/user/entities/user.entity'

// @Entity({ name: 'sys_role', comment: '角色表' })
// export class _RoleEntity extends CommonEntity {
//   @Column({
//     comment: '父角色ID',
//     name: 'parent_id',
//     type: 'varchar',
//     length: 36,
//     charset: 'ascii',
//     nullable: true,
//   })
//   parentId: string | null

//   @Column({
//     comment: '角色名',
//     name: 'name',
//     type: 'varchar',
//     length: 64,
//     unique: true,
//   })
//   name: string

//   @Column({
//     comment: '角色编码',
//     name: 'code',
//     type: 'varchar',
//     length: 100,
//     unique: true,
//   })
//   code: string

//   // @Index('IDX_ROLE_SORT_ORDER', ['sort_order'])
//   // @Column({
//   //   comment: '显示顺序',
//   //   name: 'sort_order',
//   //   type: 'tinyint',
//   //   unsigned: true,
//   //   default: SortOrderEnum.HIGH_PRIORITY,
//   // })
//   // sortOrder: SortOrderEnum

//   // @Column({
//   //   comment: '数据权限范围',
//   //   name: 'dataScope',
//   //   type: 'tinyint',
//   //   unsigned: true,
//   //   default: DataScopeEnum.CUSTOM,
//   // })
//   // dataScope: DataScopeEnum

//   // @Column({
//   //   comment: '部门树是否关联显示',
//   //   name: 'dept_tree_check_strictly',
//   //   type: 'tinyint',
//   //   unsigned: true,
//   //   default: CheckEnum.TRUE,
//   // })
//   // deptTreeCheckStrictly: CheckEnum

//   // @Column({
//   //   comment: '权限树是否关联显示',
//   //   name: 'permissions_tree_check_strictly',
//   //   type: 'tinyint',
//   //   unsigned: true,
//   //   default: CheckEnum.TRUE,
//   // })
//   // permissionsTreeCheckStrictly: CheckEnum

//   @ManyToMany(() => UserEntity, (user) => user.roles)
//   users: UserEntity[]

//   @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
//     cascade: true,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//     createForeignKeyConstraints: false,
//     eager: true,
//   })
//   @JoinTable({
//     name: 'sys_role_permission',
//     joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
//     inverseJoinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
//   })
//   permissions: PermissionEntity[]

//   @ManyToMany(() => DeptEntity, (dept) => dept.roles, {
//     cascade: true,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//     createForeignKeyConstraints: false,
//     eager: true,
//   })
//   @JoinTable({
//     name: 'sys_role_dept',
//     joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
//     inverseJoinColumns: [{ name: 'dept_id', referencedColumnName: 'id' }],
//   })
//   depts: DeptEntity[]
// }
