import type { ActionTypeEnum } from '@packages/types'
import type { CreatePermissionDTO, PermissionCodeDTO, PermissionIdDTO, PermissionNameDTO } from './dto'
import type { PermissionEntity } from './entities/permission.entity'
import type { FindAllPermissionVO, PermissionVO } from './vo'
import type { UPDATE_STATUS_VO } from '@/common/constants'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import type { MenuEntity } from '@/modules/system/menu/entities/menu.entity'
import type { RoleEntity } from '@/modules/system/role/entities/role.entity'

/** 权限表实体接口 */
export interface IPermissionEntity {
  /** 权限名 */
  name: string
  /** 权限编码(领域名:操作名) */
  permissionCode: string
  /** 领域 */
  domain: string
  /** 操作类型 */
  actionType: ActionTypeEnum
  /** 权限N-N角色 */
  roles: RoleEntity[]
  /** 权限N-N菜单 */
  menus: MenuEntity[]
}

/** 权限模块服务接口 */
export interface IPermissionService {
  /**
   * 创建权限
   * @param createPermissionDTO 创建参数
   * @param by 操作者，默认system
   */
  create: (createPermissionDTO: CreatePermissionDTO, by?: string) => Promise<PermissionVO>

  /**
   * 根据id删除权限
   * @param permissionIdDTO 权限ID
   * @param by 操作者，默认system
   */
  delById: (permissionIdDTO: PermissionIdDTO, by?: string) => Promise<boolean>

  /**
   * 分页查询所有权限
   * @param findAllDTO 查询参数
   * @param isVO 是否返回VO格式(默认:true)
   */
  findAll: ((findAllDTO: FindAllDTO, isVO: true) => Promise<FindAllPermissionVO>) &
    ((findAllDTO: FindAllDTO, isVO: false) => Promise<[PermissionEntity[], number]>) &
    ((findAllDTO: FindAllDTO) => Promise<FindAllPermissionVO>)

  /**
   * 根据id查询单个权限
   * @param permissionIdDTO 权限ID
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneById: ((permissionIdDTO: PermissionIdDTO, isVO: true) => Promise<PermissionVO>) &
    ((permissionIdDTO: PermissionIdDTO, isVO: false) => Promise<PermissionEntity>) &
    ((permissionIdDTO: PermissionIdDTO) => Promise<PermissionVO>)

  /**
   * 根据name查询单个权限
   * @param permissionNameDTO 权限名
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneByName: ((permissionNameDTO: PermissionNameDTO, isVO: true) => Promise<PermissionVO>) &
    ((permissionNameDTO: PermissionNameDTO, isVO: false) => Promise<PermissionEntity>) &
    ((permissionNameDTO: PermissionNameDTO) => Promise<PermissionVO>)

  /**
   * 根据code查询单个权限
   * @param permissionCodeDTO 权限编码
   * @param isVO 是否返回VO格式(默认:true)
   */
  findOneByCode: ((permissionCodeDTO: PermissionCodeDTO, isVO: true) => Promise<PermissionVO>) &
    ((permissionCodeDTO: PermissionCodeDTO, isVO: false) => Promise<PermissionEntity>) &
    ((permissionCodeDTO: PermissionCodeDTO) => Promise<PermissionVO>)

  /**
   * 更新状态
   * @param permissionIdDTO 权限ID
   * @param updateStatusDTO 更新状态参数
   * @param by 操作者，默认system
   */
  updateStatusById: (permissionIdDTO: PermissionIdDTO, updateStatusDTO: UpdateStatusDTO, by?: string) => Promise<boolean>
}

/** 权限模块控制器接口 */
export interface IPermissionController {
  /**
   * 创建权限接口
   * @param createPermissionDTO 创建参数
   */
  create: (createPermissionDTO: CreatePermissionDTO) => Promise<PermissionVO>

  /**
   * 分页查询接口
   * @param findAllDTO 查询参数
   */
  findAll: (findAllDTO: FindAllDTO) => Promise<FindAllPermissionVO>

  /**
   * 查询单个权限详情接口
   * @param permissionIdDTO 权限ID
   */
  findOne: (permissionIdDTO: PermissionIdDTO) => Promise<PermissionVO>

  /**
   * 更新状态接口
   * @param permissionIdDTO 权限ID
   * @param updateStatusDTO 更新状态参数
   */
  updateStatus: (permissionIdDTO: PermissionIdDTO, updateStatusDTO: UpdateStatusDTO) => Promise<typeof UPDATE_STATUS_VO>
}
