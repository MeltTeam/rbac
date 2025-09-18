import type { SexEnum } from '@packages/types'
import type { PostEntity } from '../post/entities/post.entity'
import type { RoleEntity } from '../role/entities/role.entity'
import type { CreateDTO, DelByIdDTO, FindOneByIdDTO, FindOneByNameDTO, PatchByIdDTO, PatchDTO } from './dto'
import type { UserEntity } from './entities/user.entity'
import type { UserProfileEntity } from './entities/userProfile.entity'
import type { DEL_BY_ID_VO, PATCH_VO } from './user.constant'
import type { FindAllUserVO, UserVO } from './vo'
import type { FindAllDTO } from '@/common/dto/findAll.dto'
import type { ICommonEntity } from '@/common/entities/ICommonEntity'

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
export interface CreateOptions extends CreateDTO {
  /** 邮箱 */
  email?: string
  /** 备注 */
  remark?: string
}

/** 用户模块服务接口 */
export interface IUserService {
  /**
   * 密码明文和密码密文对比
   * @param currentPwd 当前密码明文
   * @param userSalt 用户盐
   * @param encryptedPwd 密码密文
   */
  compare: (currentPwd: string, userSalt: string, encryptedPwd: string) => Promise<boolean>

  /**
   * 密码明文加密
   * @param pwd 密码明文
   * @param userSalt 用户盐
   */
  encryptPassword: (pwd: string, userSalt: string) => Promise<string>

  /**
   * 创建用户
   * @param createOptions 创建参数
   * @param by 操作者，默认sys
   */
  create: (createOptions: CreateOptions, by: string) => Promise<UserVO>

  /**
   * 根据id删除用户
   * @param delByIdDTO 删除参数
   * @param by 操作者，默认sys
   */
  delById: (delByIdDTO: DelByIdDTO, by: string) => Promise<boolean>

  /**
   * 分页查询所有用户
   * @param findAllDTO 查询参数
   */
  findAll: (findAllDTO: FindAllDTO) => Promise<FindAllUserVO>

  /**
   * 根据id查询单个用户
   * @param findOneByIdDTO 查询参数
   */
  findOneById: (findOneByIdDTO: FindOneByIdDTO) => Promise<UserVO>

  /**
   * 根据name查询单个用户
   * @param findOneByNameDTO 查询参数
   */
  findOneByName: (findOneByNameDTO: FindOneByNameDTO) => Promise<UserVO>

  /**
   * 修改用户
   * @param patchByIdDTO 更新参数(ID)
   * @param patchDTO 更新参数
   * @param by 操作者，默认sys
   */
  patch: (patchByIdDTO: PatchByIdDTO, patchDTO: PatchDTO, by?: string) => Promise<boolean>

  /**
   * 更新登录记录
   * @param id 用户ID
   * @param loginAt 最后登录时间
   * @param loginIp 最后登录的IP
   */
  updateLoginInfo: (id: string, loginAt: Date, loginIp: string) => Promise<boolean>

  /**
   * 重置密码
   * @param id 用户ID
   * @param pwd 新密码明文
   */
  updatePwd: (id: string, pwd: string) => Promise<boolean>
}

/** 用户模块控制器接口 */
export interface IUserController {
  /**
   * 创建接口
   * @param createDTO 创建参数
   */
  create: (createDTO: CreateDTO) => Promise<UserVO>

  /**
   * 根据id删除接口
   * @param delByIdDTO 删除参数
   */
  delById: (delByIdDTO: DelByIdDTO) => Promise<typeof DEL_BY_ID_VO>

  /**
   * 分页查询接口
   * @param findAllDTO 查询参数
   */
  findAll: (findAllDTO: FindAllDTO) => Promise<FindAllUserVO>

  /**
   * 根据id查询单个信息接口
   * @param findOneByIdDTO 查询参数(id)
   */
  findOneById: (findOneByIdDTO: FindOneByIdDTO) => Promise<UserVO>

  /**
   * 修改接口
   * @param patchByIdDTO 修改参数(id)
   * @param patchDTO 修改参数
   */
  patch: (patchByIdDTO: PatchByIdDTO, patchDTO: PatchDTO) => Promise<typeof PATCH_VO>
}
