import type { ResultSetHeader } from 'mysql2/promise'
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import type { DelByIdDTO, FindOneByIdDTO, FindOneByNameDTO, PatchByIdDTO, PatchDTO } from './dto'
import type { CreateOptions, IUserService } from './IUser'
import type { FindAllDTO } from '@/common/dto/findAll.dto'
import type { AppConfigType } from '@/configs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommonBusiness, UserBusiness } from '@packages/types'
import { MD5 } from 'crypto-js'
import { isUndefined } from 'lodash-es'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { CommonBusinessException } from '@/common/exceptions'
import { sha256, uuid_v4, wordArray } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/configs'
import { UserEntity } from './entities/user.entity'
import { UserProfileEntity } from './entities/userProfile.entity'
import { UserException } from './user.exception'
import { FindAllUserVO, UserVO } from './vo'

@Injectable()
export class UserService implements IUserService {
  // 缓存表字段名
  private readonly columnsUser: string[]
  private readonly columnsUserProfile: string[]
  constructor(
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {
    // 获取表字段名
    this.columnsUser = entityManager.getRepository(UserEntity).metadata.columns.map((c) => c.propertyName)
    this.columnsUserProfile = entityManager.getRepository(UserProfileEntity).metadata.columns.map((c) => c.propertyName)
  }

  async compare(currentPwd: string, userSalt: string, encryptedPwd: string) {
    const currentEncryptedPwd = await this.encryptPassword(currentPwd, userSalt)
    return currentEncryptedPwd === encryptedPwd
  }

  async encryptPassword(pwd: string, userSalt: string) {
    const { salt: APP_SALT } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const HASH_SALT = wordArray(`${APP_SALT}:${userSalt}`)
    return sha256(pwd, HASH_SALT)
  }

  async create(createOptions: CreateOptions, by: string = SYSTEM_DEFAULT_BY) {
    // 开启事务
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { name, pwd: password, email } = createOptions

      const hasUsername = await entityManager.findOne(UserEntity, { where: { name } })
      if (hasUsername) throw new UserException(UserBusiness.NAME_ALREADY_EXISTS)

      if (email) {
        const hasEmail = await entityManager.findOne(UserProfileEntity, { where: { email }, select: ['id'] })
        if (hasEmail) throw new UserException(UserBusiness.EMAIL_ALREADY_EXISTS)
      }

      // 新用户
      const salt = uuid_v4()
      const pwd = await this.encryptPassword(password, salt)
      const now = new Date()
      const newUser = entityManager.create(UserEntity, { name, salt, pwd, createdBy: by, createdAt: now, updatedBy: by, updatedAt: now })
      // 新档案
      const avatar = `https://cn.cravatar.com/avatar/${email ? MD5(email.toLowerCase()).toString() : ''}`
      const newProfile = entityManager.create(UserProfileEntity, {
        email: email ?? null,
        avatar,
        createdBy: by,
        createdAt: now,
        updatedBy: by,
        updatedAt: now,
      })
      newUser.profile = newProfile

      const user = await entityManager.save(UserEntity, newUser)
      const VO = new UserVO(user)
      return VO
    })
  }

  async delById(delByIdDTO: DelByIdDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = delByIdDTO
      const now = new Date()
      const sql = `
      UPDATE sys_user       u
      JOIN   sys_user_profile p ON p.user_id = u.id
      SET u.updated_at = ?,
          u.updated_by = ?,
          u.deleted_at = ?,
          u.deleted_by = ?,
          p.updated_at = ?,
          p.updated_by = ?,
          p.deleted_at = ?,
          p.deleted_by = ?
      WHERE u.id = ?
        AND u.deleted_at IS NULL`
      const params = [now, by, now, by, now, by, now, by, id]
      const res = await entityManager.query<ResultSetHeader>(sql, params)
      if (res.affectedRows === 0) throw new UserException(UserBusiness.NOT_FOUND)
      return true
    })
  }

  async findAll(findAllDTO: FindAllDTO) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      let { limit = 10, page = 1 } = findAllDTO
      limit = +limit
      page = +page
      const skip = (page - 1) * limit
      const [data, total] = await entityManager.findAndCount(UserEntity, { skip, take: limit, order: { createdAt: 'DESC' } })
      const VO = new FindAllUserVO({ DataConstructor: UserVO, data, limit, page, total })
      return VO
    })
  }

  async findOneById(findOneByIdDTO: FindOneByIdDTO) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = findOneByIdDTO
      const user = await entityManager.findOne(UserEntity, { where: { id } })
      if (!user) throw new UserException(UserBusiness.NOT_FOUND)
      const VO = new UserVO(user)
      return VO
    })
  }

  async findOneByName(findOneByNameDTO: FindOneByNameDTO) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { name } = findOneByNameDTO
      const user = await entityManager.findOne(UserEntity, { where: { name } })
      if (!user) throw new UserException(UserBusiness.NOT_FOUND)
      const VO = new UserVO(user)
      return VO
    })
  }

  async patch(patchByIdDTO: PatchByIdDTO, patchDTO: PatchDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = patchByIdDTO
      // 看看哪个参数是哪个表的
      const updateUser: QueryDeepPartialEntity<UserEntity> = {}
      const updateUserProfile: QueryDeepPartialEntity<UserProfileEntity> = {}
      let hasData = false
      for (const [k, v] of Object.entries(patchDTO)) {
        // 没有就下一个
        if (isUndefined(v)) continue
        hasData = true
        // 是否为用户表参数
        if (this.columnsUser.includes(k)) (updateUser as any)[k] = v
        // 是否为用户档案表参数
        if (this.columnsUserProfile.includes(k)) (updateUserProfile as any)[k] = v
      }
      if (!hasData) throw new CommonBusinessException(CommonBusiness.PROMPT_FOR_MODIFICATION)

      //  一次性加锁并拿到 profileId
      const user = await entityManager
        .createQueryBuilder(UserEntity, 'u')
        .innerJoinAndSelect('u.profile', 'p')
        .where('u.id = :id')
        .andWhere('u.deletedAt IS NULL')
        .setParameters({ id })
        .useTransaction(true) // 显式走当前事务连接
        .setLock('pessimistic_write') // SELECT … FOR UPDATE
        .getOne()

      if (!user) throw new UserException(UserBusiness.NOT_FOUND)

      // 唯一性校验（复用同事务，防止幻读）
      // 并行校验
      const [nameExist, emailExist, phoneExist] = await Promise.all([
        updateUser.name
          ? entityManager
              .createQueryBuilder(UserEntity, 'u')
              .where('u.name = :name')
              .andWhere('u.id != :id')
              .setParameters({ name: updateUser.name, id })
              .getExists()
          : false,
        updateUserProfile.email
          ? entityManager
              .createQueryBuilder(UserProfileEntity, 'p')
              .where('p.email = :email')
              .andWhere('p.user_id != :uid')
              .setParameters({ email: updateUserProfile.email, uid: id })
              .getExists()
          : false,
        updateUserProfile.phone
          ? entityManager
              .createQueryBuilder(UserProfileEntity, 'p')
              .where('p.phone = :phone')
              .andWhere('p.user_id != :uid')
              .setParameters({ phone: updateUserProfile.phone, uid: id })
              .getExists()
          : false,
      ])
      if (nameExist) throw new UserException(UserBusiness.NAME_ALREADY_EXISTS)
      if (emailExist) throw new UserException(UserBusiness.EMAIL_ALREADY_EXISTS)
      if (phoneExist) throw new UserException(UserBusiness.PHONE_ALREADY_EXISTS)

      const now = new Date()
      updateUser.updatedBy = by
      updateUser.updatedAt = now
      updateUserProfile.updatedBy = by
      updateUserProfile.updatedAt = now

      await Promise.all([
        entityManager.update(UserEntity, { id }, updateUser),
        entityManager.update(UserProfileEntity, { id: user.profile.id }, updateUserProfile),
      ])
      return true
    })
  }

  async updateLoginInfo(id: string, loginAt: Date, loginIp: string) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      await entityManager.update(UserEntity, { id }, { loginAt, loginIp })
      return true
    })
  }

  async updatePwd(id: string, pwd: string) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      // 新盐
      const salt = uuid_v4()
      const encryptedPwd = await this.encryptPassword(pwd, salt)
      const now = new Date()
      await entityManager.update(UserEntity, { id }, { pwd: encryptedPwd, salt, pwdUpdateAt: now, pwdUpdateBy: id })
      return true
    })
  }
}
