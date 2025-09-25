import type { IMenuEntity } from '../IMenu'
import { CheckEnum, MenuTypeEnum } from '@packages/types'
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm'
import { CommonEntity } from '@/common/entities/common.entity'
import { PermissionEntity } from '@/modules/system/permission/entities/permission.entity'
import { MenuTreeEntity } from './menuTree.entity'

@Entity({ name: 'sys_menu', comment: '菜单表' })
@Index(['name', 'menuCode', 'routeName'], { unique: true })
export class MenuEntity extends CommonEntity implements IMenuEntity {
  @Column({
    comment: '父菜单ID',
    name: 'parent_id',
    type: 'varchar',
    length: 36,
    charset: 'ascii',
    nullable: true,
  })
  parentId: string | null

  @Column({
    comment: '菜单名',
    name: 'name',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string

  @Column({
    comment: '菜单编码(MENU:路由名称,BUTTON:路由名称,COMPONENT:路由名称,DIRECTORY:路由名称,LINK:路由名称,INNER_LINK:路由名称)',
    name: 'menu_code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  menuCode: string

  @Column({
    comment: '菜单路径',
    name: 'path',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  path: string

  @Column({
    comment: '路由参数',
    name: 'query',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    nullable: true,
    default: null,
  })
  query: string | null

  @Column({
    comment: '组件路径',
    name: 'component',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    nullable: true,
    default: null,
  })
  component: string | null

  @Column({
    comment: '路由名称',
    name: 'route_name',
    type: 'varchar',
    length: 64,
    unique: true,
    nullable: true,
    default: null,
  })
  routeName: string | null

  @Column({
    comment: '图标地址',
    name: 'icon',
    type: 'varchar',
    length: 1024,
    charset: 'utf8mb4',
    default: '',
  })
  icon: string

  @Column({
    comment: '是否缓存',
    name: 'is_cache',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isCache: CheckEnum

  @Column({
    comment: '是否隐藏',
    name: 'is_visible',
    type: 'tinyint',
    unsigned: true,
    default: CheckEnum.FALSE,
  })
  isVisible: CheckEnum

  @Column({
    comment: '菜单类型',
    name: 'menu_type',
    type: 'tinyint',
    unsigned: true,
    default: MenuTypeEnum.MENU,
  })
  menuType: MenuTypeEnum

  @ManyToMany(() => PermissionEntity, (permission) => permission.menus)
  permissions: PermissionEntity[]

  @OneToMany(() => MenuTreeEntity, (node) => node.descendantRole)
  ancestorNodes: MenuTreeEntity[]

  @OneToMany(() => MenuTreeEntity, (node) => node.ancestorRole)
  descendantNodes: MenuTreeEntity[]
}
