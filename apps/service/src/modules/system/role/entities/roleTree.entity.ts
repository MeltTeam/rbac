import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { RoleEntity } from './role.entity'

@Entity({ name: 'sys_role_tree', comment: '角色树表' })
@Index(['ancestorId', 'descendantId'], { unique: true })
export class RoleTreeEntity {
  @PrimaryColumn({
    comment: '祖先角色ID',
    name: 'ancestor_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  ancestorId: string

  @PrimaryColumn({
    comment: '后代角色ID',
    name: 'descendant_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  descendantId: string

  @Column({
    comment: '路径长度(0 表示自己)',
    name: 'depth',
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  depth: number

  @ManyToOne(() => RoleEntity, (role) => role.ancestorNodes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({
    name: 'ancestor_id',
    referencedColumnName: 'id',
  })
  ancestorRole: RoleEntity

  @ManyToOne(() => RoleEntity, (role) => role.descendantNodes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({
    name: 'descendant_id',
    referencedColumnName: 'id',
  })
  descendantRole: RoleEntity
}
