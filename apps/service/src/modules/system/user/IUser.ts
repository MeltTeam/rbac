import type { ICommonEntity } from '@entities/ICommonEntity'
import type { SexEnum } from '@packages/types'
import type { FindOptionsWhere, UpdateResult } from 'typeorm'
import type { PostEntity } from '../post/entities/post.entity'
import type { RoleEntity } from '../role/entities/role.entity'
import type { AddDTO } from './dto/add.dto'
import type { DelIdDTO } from './dto/del.dto'
import type { FindAllDTO } from './dto/findAll.dto'
import type { PatchDTO, PatchIdDTO } from './dto/patch.dto'
import type { UserEntity } from './entities/user.entity'
import type { UserProfileEntity } from './entities/userProfile.entity'
import type { DEL_USER_OK, PATCH_USER_OK } from './user.constant'
import type { FindAllVO, UserVO } from './vo'

/** 用户表实体接口 */
export interface IUserEntity extends ICommonEntity {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd?: string
  /** 最后登录的IP */
  loginIp: string | null
  /** 最后登录时间 */
  loginAt: Date | null
  /** 密码最后更新时间 */
  pwdUpdateAt: Date | null
  /** 密码最后更新者 */
  pwdUpdateBy: string | null
  /** 盐值 */
  salt?: string
  /** 插入前生成盐值 */
  generateSalt: () => void

  /** 用户1-1档案 */
  profile?: UserProfileEntity
  /** 用户N-1角色 */
  role?: RoleEntity
  /** 用户1-N岗位 */
  posts?: PostEntity[]
}

/** 用户档案表实体接口 */
export interface IUserProfileEntity extends ICommonEntity {
  /** 用户别名 */
  nickName: string
  /** 性别(10:女 20:男 30:未知 默认:30) */
  sex: SexEnum
  /** 出生日期 */
  birthday: Date | null
  /** 用户邮箱 */
  email: string | null
  /** 电话号码 */
  phone: string | null
  /** 头像地址 */
  avatar: string | null
  /** 档案1-1用户 */
  user: UserEntity
}

/** 用于兼容其他模块传来的参数 */
export interface AddOptions extends AddDTO {
  /** 邮箱 */
  email?: string
  /** 备注 */
  remark?: string
}

/** 用户模块服务接口 */
export interface IUserService {
  /**
   * 添加
   * @param addOptions 添加参数
   * @param by 操作者，默认sys
   */
  add: (addOptions: AddOptions, by: string) => Promise<UserVO>

  /**
   * 删除
   * @param delIdDTO 删除参数
   * @param by 操作者，默认sys
   */
  del: (delIdDTO: DelIdDTO, by: string) => Promise<boolean>

  /**
   * 分页查询
   * @param findAllDTO 查询参数
   */
  findAll: (findAllDTO: FindAllDTO) => Promise<FindAllVO>

  /**
   * 单个查询
   * @param where 查询参数
   */
  findOne: (where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]) => Promise<UserVO>

  /**
   * 更新
   * @param patchIdDTO 更新参数(ID)
   * @param patchDTO 更新参数
   * @param by 操作者，默认sys
   */
  patch: (patchIdDTO: PatchIdDTO, patchDTO: PatchDTO, by?: string) => Promise<[UpdateResult, UpdateResult]>
}

/** 用户模块控制器接口 */
export interface IUserController {
  /**
   * 添加接口
   * @param addDTO 添加参数
   */
  add: (addDTO: AddDTO) => Promise<UserVO>

  /**
   * 删除接口
   * @param delIdDTO 删除参数
   */
  del: (delIdDTO: DelIdDTO) => Promise<typeof DEL_USER_OK>

  /**
   * 修改接口
   * @param patchIdDTO 修改参数(id)
   * @param patchDTO 修改参数
   */
  patch: (patchIdDTO: PatchIdDTO, patchUserDTO: PatchDTO) => Promise<typeof PATCH_USER_OK>
}
