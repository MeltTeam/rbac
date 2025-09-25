import type { IMenuTreeEntity } from '../IMenu'
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { MenuEntity } from './menu.entity'

@Entity({ name: 'sys_menu_tree', comment: '菜单树表' })
@Index(['ancestorId', 'descendantId'], { unique: true })
export class MenuTreeEntity implements IMenuTreeEntity {
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

  @ManyToOne(() => MenuEntity, (menu) => menu.ancestorNodes, {
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
  ancestorRole: MenuEntity

  @ManyToOne(() => MenuEntity, (menu) => menu.descendantNodes, {
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
  descendantRole: MenuEntity
}
