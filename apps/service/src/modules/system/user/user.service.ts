import type { FindOptionsWhere, Repository } from 'typeorm'
import type { DelIdDTO } from './dto/del.dto'
import type { FindAllDTO } from './dto/findAll.dto'
import type { PatchDTO, PatchIdDTO } from './dto/patch.dto'
import type { AddOptions, IUserService } from './IUser'
import type { AppConfigType } from '@/configs'
import { SYSTEM_DEFAULT_BY } from '@constants/index'
import { CommonBusinessException } from '@exceptions/index'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { CommonBusiness, UserBusiness } from '@packages/types'
import { FindAllVO, UserVO } from '@user/vo'
import { sha256, uuid_v4, wordArray } from '@utils/index'
import { MD5 } from 'crypto-js'
import { isEmpty, isUndefined } from 'lodash-es'
import { APP_CONFIG_KEY } from '@/configs'
import { UserEntity } from './entities/user.entity'
import { UserProfileEntity } from './entities/userProfile.entity'
import { UserException } from './user.exception'

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly configService: ConfigService,
  ) {}

  async compare(currentPwd: string, userSalt: string, encryptedPwd: string) {
    const currentEncryptedPwd = await this.encryptPassword(currentPwd, userSalt)
    return currentEncryptedPwd === encryptedPwd
  }

  async encryptPassword(pwd: string, userSalt: string) {
    const { salt: APP_SALT } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const HASH_SALT = wordArray(`${APP_SALT}:${userSalt}`)
    return sha256(pwd, HASH_SALT)
  }

  async handlerAdd(addOptions: AddOptions, by: string = SYSTEM_DEFAULT_BY) {
    const { name, pwd, email } = addOptions
    if (email) {
      const hasEmail = await this.userRepository.findOne({
        where: { profile: { email } },
      })
      if (hasEmail) throw new UserException(UserBusiness.EMAIL_ALREADY_EXISTS)
    }
    const hasUsername = await this.userRepository.findOne({
      where: { name },
    })
    if (hasUsername) throw new UserException(UserBusiness.NAME_ALREADY_EXISTS)
    // 新用户
    const USER_SALT = uuid_v4()
    const USER_PWD = await this.encryptPassword(pwd, USER_SALT)
    const newUser = new UserEntity()
    newUser.name = name
    newUser.salt = USER_SALT
    newUser.pwd = USER_PWD
    newUser.createdBy = by
    newUser.updatedBy = by
    // 新档案
    const newProfile = new UserProfileEntity()
    newProfile.createdBy = by
    newProfile.updatedBy = by
    newProfile.email = email ?? null
    newProfile.avatar = `https://cn.cravatar.com/avatar/${email ? MD5(email.toLowerCase()).toString() : ''}`
    newUser.profile = newProfile

    const user = await this.userRepository.save(newUser)
    const VO = new UserVO(user)
    return VO
  }

  async handlerDel(delIdDTO: DelIdDTO, by: string = SYSTEM_DEFAULT_BY) {
    const { id } = delIdDTO
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new UserException(UserBusiness.NOT_FOUND)
    const now = new Date()
    const delObj = {
      updatedAt: now,
      updatedBy: by,
      deletedAt: now,
      deletedBy: by,
    }
    await Promise.all([this.userRepository.update({ id }, { ...delObj }), this.userProfileRepository.update({ id: user.profile.id }, { ...delObj })])
    return true
  }

  async handlerFindAll(findAllDTO: FindAllDTO) {
    let { limit = 10, page = 1 } = findAllDTO
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })
    const VO = new FindAllVO()
    VO.data = data.map((data) => new UserVO(data))
    VO.limit = limit
    VO.page = page
    VO.total = total
    VO.totalPages = Math.ceil(total / limit)
    return VO
  }

  async handlerFindOne(where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]) {
    const user = await this.userRepository.findOne({
      where,
    })
    if (!user) throw new UserException(UserBusiness.NOT_FOUND)
    const VO = new UserVO(user)
    return VO
  }

  async handlerPatch(patchIdDTO: PatchIdDTO, patchDTO: PatchDTO, by: string = SYSTEM_DEFAULT_BY) {
    const { id } = patchIdDTO
    const User = new UserEntity()
    const Profile = new UserProfileEntity()
    const updateUser = {} as UserEntity
    const updateProfile = {} as UserProfileEntity
    for (const key in patchDTO) {
      const value = patchDTO[key]
      if (isUndefined(value)) {
        delete patchDTO[key]
      } else {
        key in User && (updateUser[key] = value)
        key in Profile && (updateProfile[key] = value)
      }
    }
    if (isEmpty(patchDTO)) throw new CommonBusinessException(CommonBusiness.PROMPT_FOR_MODIFICATION)
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new UserException(UserBusiness.NOT_FOUND)
    if (updateUser.name) {
      const user = await this.userRepository.findOne({ where: { name: updateUser.name } })
      if (user) throw new UserException(UserBusiness.NAME_ALREADY_EXISTS)
    }
    if (updateProfile.email) {
      const profile = await this.userProfileRepository.findOne({ where: { email: updateProfile.email } })
      if (profile) throw new UserException(UserBusiness.EMAIL_ALREADY_EXISTS)
    }
    if (updateProfile.phone) {
      const profile = await this.userProfileRepository.findOne({ where: { phone: updateProfile.phone } })
      if (profile) throw new UserException(UserBusiness.PHONE_ALREADY_EXISTS)
    }
    updateUser.updatedBy = by
    updateProfile.updatedBy = by
    return await Promise.all([
      this.userRepository.update({ id }, updateUser),
      this.userProfileRepository.update({ id: user.profile.id }, updateProfile),
    ])
  }
}
