import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import type { UpdateUserDTO, UserIdDTO, UserNameDTO } from './dto'
import type { CreateUserOptions, IUserService } from './IUser'
import type { FindAllDTO, UpdateStatusDTO } from '@/common/dto'
import type { AppConfigType } from '@/configs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { CommonBusiness, UserBusiness } from '@packages/types'
import { MD5 } from 'crypto-js'
import { isUndefined } from 'lodash-es'
import { EntityManager, Not, Repository } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { CommonBusinessException } from '@/common/exceptions'
import { sha256, uuid_v4, wordArray } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/configs'
import { Jwt2Service } from '@/infrastructure/jwt2/jwt2.service'
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
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwt2Service: Jwt2Service,
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

  async create(createUserOptions: CreateUserOptions, by: string = SYSTEM_DEFAULT_BY) {
    // 开启事务
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { name, pwd: password, email } = createUserOptions

      const [hasUserName, hasEmail] = await Promise.all([
        entityManager.findOne(UserEntity, { where: { name }, lock: { mode: 'pessimistic_write' } }),
        email ? entityManager.findOne(UserProfileEntity, { where: { email }, lock: { mode: 'pessimistic_write' } }) : null,
      ])
      if (hasUserName) throw new UserException(UserBusiness.NAME_ALREADY_EXISTS)
      if (hasEmail) throw new UserException(UserBusiness.EMAIL_ALREADY_EXISTS)

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
      console.warn(user)
      const VO = new UserVO(user)
      return VO
    })
  }

  async delById(userIdDTO: UserIdDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = userIdDTO
      const now = new Date()

      const user = await entityManager
        .createQueryBuilder(UserEntity, 'u')
        .select(['u.id', 'u.profile_id'])
        .where('u.id = :id')
        .andWhere('u.deleted_at IS NULL')
        .setParameters({ id })
        .useTransaction(true)
        .setLock('pessimistic_write')
        .getOne()
      if (!user) throw new UserException(UserBusiness.NOT_FOUND)
      await Promise.all([
        entityManager.update(UserEntity, { id }, { deletedAt: now, deletedBy: by }),
        entityManager.update(UserProfileEntity, { id: user.profile.id }, { deletedAt: now, deletedBy: by }),
        this.jwt2Service.delRedisToken(id),
      ])
      return true
    })
  }

  findAll(findAllDTO: FindAllDTO, isVO: true): Promise<FindAllUserVO>
  findAll(findAllDTO: FindAllDTO, isVO: false): Promise<[UserEntity[], number]>
  findAll(findAllDTO: FindAllDTO): Promise<FindAllUserVO>
  async findAll(findAllDTO: FindAllDTO, isVO: boolean = true) {
    let { limit = 10, page = 1 } = findAllDTO
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.userRepository.findAndCount({ skip, take: limit, order: { createdAt: 'DESC' } })
    if (isVO) {
      const VO = new FindAllUserVO({ DataConstructor: UserVO, data, limit, page, total })
      return VO
    }
    return [data, total]
  }

  findOneById(userIdDTO: UserIdDTO, isVO: true): Promise<UserVO>
  findOneById(userIdDTO: UserIdDTO, isVO: false): Promise<UserEntity>
  findOneById(userIdDTO: UserIdDTO): Promise<UserVO>
  async findOneById(userIdDTO: UserIdDTO, isVO: boolean = true) {
    const { id } = userIdDTO
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new UserException(UserBusiness.NOT_FOUND)
    if (isVO) {
      const VO = new UserVO(user)
      return VO
    }
    return user
  }

  findOneByName(userNameDTO: UserNameDTO, isVO: true): Promise<UserVO>
  findOneByName(userNameDTO: UserNameDTO, isVO: false): Promise<UserEntity>
  findOneByName(userNameDTO: UserNameDTO): Promise<UserVO>
  async findOneByName(userNameDTO: UserNameDTO, isVO: boolean = true) {
    const { name } = userNameDTO
    const user = await this.userRepository.findOne({ where: { name } })
    if (!user) throw new UserException(UserBusiness.NOT_FOUND)
    if (isVO) {
      const VO = new UserVO(user)
      return VO
    }
    return user
  }

  async update(userIdDTO: UserIdDTO, updateUserDTO: UpdateUserDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = userIdDTO
      // 看看哪个参数是哪个表的
      const updateUser: QueryDeepPartialEntity<UserEntity> = {}
      const updateUserProfile: QueryDeepPartialEntity<UserProfileEntity> = {}
      let hasData = false
      for (const [k, v] of Object.entries(updateUserDTO)) {
        // 没有就下一个
        if (isUndefined(v)) continue
        hasData = true
        // 是否为用户表参数
        if (this.columnsUser.includes(k)) (updateUser as any)[k] = v
        // 是否为用户档案表参数
        if (this.columnsUserProfile.includes(k)) (updateUserProfile as any)[k] = v
      }
      if (!hasData) throw new CommonBusinessException(CommonBusiness.PROMPT_FOR_MODIFICATION)

      const user = await entityManager.findOne(UserEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })

      if (!user) throw new UserException(UserBusiness.NOT_FOUND)

      // 唯一性校验（复用同事务，防止幻读）
      // 并行校验
      const profileId = user.profile.id
      const [nameExist, emailExist, phoneExist] = await Promise.all([
        updateUser.name
          ? entityManager.exists(UserEntity, {
              where: { name: updateUser.name as string, id: Not(id) },
              lock: { mode: 'pessimistic_write' },
            })
          : null,
        updateUserProfile.email
          ? entityManager.exists(UserProfileEntity, {
              where: { email: updateUserProfile.email as string, id: Not(profileId) },
              lock: { mode: 'pessimistic_write' },
            })
          : null,
        updateUserProfile.phone
          ? entityManager.exists(UserProfileEntity, {
              where: { phone: updateUserProfile.phone as string, id: Not(profileId) },
              lock: { mode: 'pessimistic_write' },
            })
          : null,
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

  async updatePwd(id: string, pwd: string, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      // 新盐
      const salt = uuid_v4()
      const encryptedPwd = await this.encryptPassword(pwd, salt)
      const now = new Date()
      await entityManager.update(UserEntity, { id }, { pwd: encryptedPwd, salt, pwdUpdateAt: now, pwdUpdateBy: by })
      return true
    })
  }

  async updateStatusById(userIdDTO: UserIdDTO, updateStatusDTO: UpdateStatusDTO, by: string = SYSTEM_DEFAULT_BY) {
    return this.entityManager.transaction(async (entityManager: EntityManager) => {
      const { id } = userIdDTO
      const { status } = updateStatusDTO

      const user = await entityManager.findOne(UserEntity, { where: { id }, lock: { mode: 'pessimistic_write' } })

      if (!user) throw new UserException(UserBusiness.NOT_FOUND)

      const now = new Date()
      await Promise.all([
        entityManager.update(UserEntity, { id }, { status, updatedBy: by, updatedAt: now }),
        entityManager.update(UserProfileEntity, { id: user.profile.id }, { status, updatedBy: by, updatedAt: now }),
      ])
      return true
    })
  }
}
