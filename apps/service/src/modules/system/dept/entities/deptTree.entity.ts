import type { IDeptTreeEntity } from '../IDept'
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { DeptEntity } from './dept.entity'

@Entity({ name: 'sys_dept_tree', comment: '部门树表' })
@Index(['ancestorId', 'descendantId'], { unique: true })
export class DeptTreeEntity implements IDeptTreeEntity {
  @PrimaryColumn({
    comment: '祖先部门ID',
    name: 'ancestor_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
  })
  ancestorId: string

  @PrimaryColumn({
    comment: '后代部门ID',
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

  @ManyToOne(() => DeptEntity, (dept) => dept.ancestorNodes, {
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
  ancestorDept: DeptEntity

  @ManyToOne(() => DeptEntity, (dept) => dept.descendantNodes, {
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
  descendantDept: DeptEntity
}
