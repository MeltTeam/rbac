import type { FindOptionsWhere, Repository } from 'typeorm'
import type { DelIdDTO } from './dto/del.dto'
import type { FindAllDTO } from './dto/findAll.dto'
import type { PatchDTO, PatchIdDTO } from './dto/patch.dto'
import type { AddOptions, IUserService } from './IUser'
import type { AppConfigType } from '@/configs'
import { BaseModule } from '@abstracts/index'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { FindAllVO, UserVO } from '@user/vo'
import { sha256, uuid_v4, wordArray } from '@utils/index'
import { MD5 } from 'crypto-js'
import { isEmpty, isUndefined } from 'lodash-es'
import { APP_CONFIG_KEY } from '@/configs'
import { UserEntity } from './entities/user.entity'
import { UserProfileEntity } from './entities/userProfile.entity'

@Injectable()
export class UserService extends BaseModule implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly configService: ConfigService,
  ) {
    super()
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

  async add(addOptions: AddOptions, by: string = '') {
    const { name, pwd, email } = addOptions
    if (email) {
      const hasEmail = await this.userRepository.findOne({
        where: { profile: { email } },
      })
      if (hasEmail) throw new BadRequestException('邮箱已存在')
    }
    const hasUsername = await this.userRepository.findOne({
      where: { name },
    })
    if (hasUsername) throw new BadRequestException('用户名已存在')
    // 新用户
    const USER_SALT = uuid_v4()
    const USER_PWD = await this.encryptPassword(pwd, USER_SALT)
    const newUser = new UserEntity()
    newUser.name = name
    newUser.salt = USER_SALT
    newUser.pwd = USER_PWD
    newUser.createdBy = by
    newUser.updatedBy = by
    // newUser.remark = remark
    // 新档案
    const newProfile = new UserProfileEntity()
    // newProfile.remark = remark
    newProfile.createdBy = by
    newProfile.updatedBy = by
    newProfile.email = email ?? null
    newProfile.avatar = `https://cn.cravatar.com/avatar/${email ? MD5(email.toLowerCase()).toString() : ''}`
    newUser.profile = newProfile

    const user = await this.userRepository.save(newUser)
    const VO = new UserVO(user)
    return VO
  }

  async del(delIdDTO: DelIdDTO, by: string = '') {
    const { id } = delIdDTO
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new BadRequestException('用户不存在')
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

  async findAll(findAllDTO: FindAllDTO) {
    let { limit = 10, page = 1 } = findAllDTO
    if (limit > 100 || limit <= 0) throw new BadRequestException('limit不在范围内')
    if (page <= 0) throw new BadRequestException('page不在范围内')
    // try {
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

  async findOne(where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]) {
    const user = await this.userRepository.findOne({
      where,
    })
    if (!user) throw new BadRequestException('该用户不存在')
    const VO = new UserVO(user)
    return VO
  }

  async patch(patchIdDTO: PatchIdDTO, patchDTO: PatchDTO, by: string = '') {
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
    if (isEmpty(patchDTO)) throw new BadRequestException(`请输入修改项`)
    !updateUser.remark && (updateUser.remark = '系统修改')
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new BadRequestException(`用户不存在`)
    if (updateUser.name) {
      const user = await this.userRepository.findOne({ where: { name: updateUser.name } })
      if (user) throw new BadRequestException(`该用户名已存在`)
    }
    if (updateProfile.email) {
      const profile = await this.userProfileRepository.findOne({ where: { email: updateProfile.email } })
      if (profile) throw new BadRequestException(`该邮箱已存在`)
    }
    if (updateProfile.phone) {
      const profile = await this.userProfileRepository.findOne({ where: { phone: updateProfile.phone } })
      if (profile) throw new BadRequestException(`该电话号码已存在`)
    }
    updateUser.updatedBy = by
    updateProfile.updatedBy = by
    return await Promise.all([
      this.userRepository.update({ id }, updateUser),
      this.userProfileRepository.update({ id: user.profile.id }, updateProfile),
    ])
  }
}
