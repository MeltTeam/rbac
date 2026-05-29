import type { EntityManager } from 'typeorm'
import type { IAuthUserService, TIdentifierType } from '../IAuthUserService'
import type { IUserEntity } from '@/modules/rbac/user/domain'
import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { UserDomainService, UserEntity } from '@/modules/rbac/user/domain'

/** 认证用户服务实现 */
@Injectable()
@LogContextClass()
export class AuthUserService implements IAuthUserService {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly clsService: ClsService,
  ) {}

  async getUserByIdentifier(identifier: string, type: TIdentifierType, em?: EntityManager): Promise<IUserEntity> {
    const users = await (async () => {
      switch (type) {
        case 'svg':
          return this.userDomainService.getUsersByNames([identifier], false, em)
        case 'email':
          return this.userDomainService.getUsersByEmails([identifier], em)
        case 'phone':
          return this.userDomainService.getUsersByPhones([identifier], em)
      }
    })()
    return users[0]
  }

  async validatePassword(password: string, user: IUserEntity): Promise<boolean> {
    return this.userDomainService.comparePwd(password, user.salt!, user.pwd!)
  }

  async updateLoginInfo(user: IUserEntity, em?: EntityManager): Promise<void> {
    const loginIp = this.clsService.get<string>(REQ_CTX.CLIENT_IP)
    const loginAt = new Date(this.clsService.get<string>(REQ_CTX.START_TIMESTAMP))
    user.loginIp = loginIp
    user.loginAt = loginAt
    await this.userDomainService.userRepo.patch([user as UserEntity], SYSTEM_DEFAULT_BY, em)
  }
}
