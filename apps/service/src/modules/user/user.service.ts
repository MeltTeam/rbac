import type { Repository } from 'typeorm'
import type { AddDto, DelDto, FindAllDto } from './dtos'
import type { AppConfigType } from '@/configs'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { MD5 } from 'crypto-js'
import { BaseModule } from '@/common/abstracts/BaseModule.abstract'
import { sha256, uuid_v4, wordArray } from '@/common/utils'
import { APP_CONFIG_KEY } from '@/configs'
import { ProfileEntity } from './entities/profile.entity'
import { UserEntity } from './entities/user.entity'
import { AddVo, FindAllVo } from './vos'

interface AddOptions extends AddDto {
  /** 邮箱 */
  email?: string
  /** 备注 */
  remark?: string
}
@Injectable()
export class UserService extends BaseModule {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
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

  async add(addOptions: AddOptions, errorMsg: string = '创建用户失败', by: string = 'sys') {
    const { username, password, email, remark = '由系统创建' } = addOptions
    if (email) {
      const hasEmail = await this.userRepository.findOne({
        where: { profile: { email } },
      })
      if (hasEmail) throw new HttpException('邮箱已存在', HttpStatus.BAD_REQUEST)
    }
    const hasUsername = await this.userRepository.findOne({
      where: { name: username },
    })
    if (hasUsername) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
    // 新用户
    const USER_SALT = uuid_v4()
    const USER_PWD = await this.encryptPassword(password, USER_SALT)
    const newUser = new UserEntity()
    newUser.name = username
    newUser.salt = USER_SALT
    newUser.pwd = USER_PWD
    newUser.createdBy = by
    newUser.updatedBy = by
    newUser.remark = remark
    // 新档案
    const newProfile = new ProfileEntity()
    newProfile.remark = remark
    newProfile.createdBy = by
    newProfile.updatedBy = by
    newProfile.email = email ?? null
    newProfile.avatar = `https://cn.cravatar.com/avatar/${email ? MD5(email.toLowerCase()).toString() : ''}`
    newUser.profile = newProfile
    try {
      const user = await this.userRepository.save(newUser)
      const VO = new AddVo(user)
      return VO
    } catch (e) {
      this.logger.error(`${this.add.name}:${e.message}`)
      throw new HttpException(`${errorMsg}:${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async del(delDto: DelDto, errorMsg: string = '删除用户失败', by: string = 'sys') {
    try {
      const { id } = delDto
      const user = await this.userRepository.findOne({ where: { id } })
      if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
      const now = new Date()
      const delObj = {
        updatedAt: now,
        updatedBy: by,
        deletedAt: now,
        deletedBy: by,
      }
      await Promise.all([this.userRepository.update({ id }, { ...delObj }), this.profileRepository.update({ id: user.profile.id }, { ...delObj })])
      return true
    } catch (e) {
      this.logger.error(`${this.del.name}:${e.message}`)
      throw new HttpException(`${errorMsg}:${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(findAllDto: FindAllDto) {
    let { limit = 10, page = 1 } = findAllDto
    limit = +limit
    page = +page
    const skip = (page - 1) * limit
    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })
    const VO = new FindAllVo()
    VO.data = data.map((data) => new AddVo(data))
    VO.limit = limit
    VO.page = page
    VO.total = total
    VO.totalPages = Math.ceil(total / limit)
    return VO
  }

  async patch() {}
}
