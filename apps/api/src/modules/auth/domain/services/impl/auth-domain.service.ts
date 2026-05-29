import type { ITokenVO } from '@packages/types'
import type { Response } from 'express'
import type { CreateAuthDTO, UpdateAuthDTO } from '../../../app'
import type { ITokenInfo } from '../../../infra/token'
import type { IAuthDomainService } from '../IAuthDomainService'
import type { FindAllDTO, UpdateSortDTO, UpdateStatusDTO } from '@/common/dto'
import type { IJwtConfig } from '@/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { isUndefined } from 'lodash-es'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { CacheService, LoggingService, REQ_CTX } from '@/common/infra'
import { uuid_v4 } from '@/common/utils'
import { JWT_CONFIG_KEY } from '@/config'
import { AuthRepository } from '../../../infra/repo'
import { JwtTokenService, TokenCacheService, TokenCookieService } from '../../../infra/token'
import { AuthEntity } from '../../entities'
import { AuthValidateService } from './auth-validate.service'

/** 认证领域服务实现 */
@Injectable()
@LogContextClass()
export class AuthDomainService implements IAuthDomainService {
  columns: string[]
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly validateService: AuthValidateService,
    private readonly configService: ConfigService,
    private readonly clsService: ClsService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly tokenCacheService: TokenCacheService,
    private readonly tokenCookieService: TokenCookieService,
    private readonly cacheService: CacheService,
    private readonly loggingService: LoggingService,
  ) {
    this.columns = this.authRepo.metadata.columns.map((c) => c.propertyName)
  }

  async resetPwd(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const accessInfo = this.clsService.get<ITokenInfo>(REQ_CTX.ACCESS_INFO)
    const accessToken = this.clsService.get<string>(REQ_CTX.ACCESS_TOKEN)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const doResetPwd = async () => {
      const oldRefreshToken = await this.tokenCacheService.getRefreshCache(userId)
      let oldRefreshInfo: ITokenInfo | null = null
      if (oldRefreshToken) {
        try {
          oldRefreshInfo = await this.jwtTokenService.verifyToken(oldRefreshToken)
        } catch {
          // 过期或无效，忽略
        }
      }
      if (oldRefreshInfo) {
        await Promise.all([
          this.tokenCacheService.setBlackListCache(oldRefreshInfo, oldRefreshToken!, refreshTokenCookieExpiresIn),
          this.tokenCacheService.delRefreshCache(userId),
        ]).catch((err) => {
          this.loggingService.error(`拉黑刷新令牌失败:${err.message}`, err.trace)
        })
      }
      const isCurrentUser = userId === accessInfo?.sub
      if (isCurrentUser) {
        await Promise.all([
          accessInfo ? this.tokenCacheService.setBlackListCache(accessInfo, accessToken!, accessTokenCookieExpiresIn) : null,
          this.tokenCookieService.clearAuthCookies(res),
        ])
      }
      return true
    }
    return this.cacheService.withLock(`resetPwd:${userId}`, doResetPwd, { expiration: 10000, retryCount: 2, retryDelay: 100 })
  }

  async login(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const { refreshTokenExpiresIn, refreshTokenCookieExpiresIn, accessTokenExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const doLogin = async () => {
      const [newAccessToken, newRefreshToken, oldRefreshToken] = await Promise.all([
        this.jwtTokenService.generateToken({ sub: userId, type: 'access', jti: uuid_v4() }, accessTokenExpiresIn),
        this.jwtTokenService.generateToken({ sub: userId, type: 'refresh', jti: uuid_v4() }, refreshTokenExpiresIn),
        this.tokenCacheService.getRefreshCache(userId),
      ])
      let oldRefreshInfo: ITokenInfo | null = null
      if (oldRefreshToken) {
        try {
          oldRefreshInfo = await this.jwtTokenService.verifyToken(oldRefreshToken)
        } catch {
          // 过期或无效，忽略
        }
      }
      await Promise.all([
        this.tokenCacheService.setRefreshCache(userId, newRefreshToken),
        this.tokenCookieService.setRefreshCookie(res, newRefreshToken),
        oldRefreshInfo ? this.tokenCacheService.setBlackListCache(oldRefreshInfo, oldRefreshToken!, refreshTokenCookieExpiresIn) : null,
      ])
      return { accessToken: newAccessToken, refreshToken: newRefreshToken } as ITokenVO
    }
    return this.cacheService.withLock(`login:${userId}`, doLogin, { expiration: 10000, retryCount: 2, retryDelay: 100 })
  }

  async logout(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const accessInfo = this.clsService.get<ITokenInfo>(REQ_CTX.ACCESS_INFO)
    const accessToken = this.clsService.get<string>(REQ_CTX.ACCESS_TOKEN)
    const refreshInfo = this.clsService.get<ITokenInfo>(REQ_CTX.REFRESH_INFO)
    const refreshToken = this.clsService.get<string>(REQ_CTX.REFRESH_TOKEN)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    await Promise.all([
      this.tokenCacheService.setBlackListCache(refreshInfo, refreshToken, refreshTokenCookieExpiresIn),
      accessInfo ? this.tokenCacheService.setBlackListCache(accessInfo, accessToken!, accessTokenCookieExpiresIn) : null,
    ]).catch((err) => {
      this.loggingService.error(`拉黑令牌失败:${err.message}`, err.trace)
    })
    await Promise.all([this.tokenCacheService.delRefreshCache(userId), this.tokenCookieService.clearAuthCookies(res)])
    return true
  }

  async refreshToken(res: Response) {
    const userId = this.clsService.get<string>(REQ_CTX.USER_ID)
    const accessInfo = this.clsService.get<ITokenInfo>(REQ_CTX.ACCESS_INFO)
    const accessToken = this.clsService.get<string>(REQ_CTX.ACCESS_TOKEN)
    const refreshInfo = this.clsService.get<ITokenInfo>(REQ_CTX.REFRESH_INFO)
    const refreshToken = this.clsService.get<string>(REQ_CTX.REFRESH_TOKEN)
    const { refreshTokenCookieExpiresIn, accessTokenCookieExpiresIn, refreshTokenExpiresIn, accessTokenExpiresIn } =
      this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const doRefresh = async () => {
      await Promise.all([
        this.tokenCacheService.delaySetBlackListCache(refreshInfo, refreshToken, refreshTokenCookieExpiresIn),
        accessInfo ? this.tokenCacheService.delaySetBlackListCache(accessInfo, accessToken!, accessTokenCookieExpiresIn) : null,
      ]).catch((err) => {
        this.loggingService.error(`拉黑令牌失败:${err.message}`, err.trace)
      })
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtTokenService.generateToken({ sub: userId, type: 'access', jti: uuid_v4() }, accessTokenExpiresIn),
        this.jwtTokenService.generateToken({ sub: userId, type: 'refresh', jti: uuid_v4() }, refreshTokenExpiresIn),
      ])
      await Promise.all([
        this.tokenCacheService.setRefreshCache(userId, newRefreshToken),
        this.tokenCookieService.setRefreshCookie(res, newRefreshToken),
      ])
      return { accessToken: newAccessToken, refreshToken: newRefreshToken } as ITokenVO
    }
    return this.cacheService.withLock(`refresh:${refreshInfo.jti}`, doRefresh, { expiration: 10000, retryCount: 2, retryDelay: 100 })
  }

  async createAuths(em: EntityManager, createDTOList: CreateAuthDTO[], by: string = SYSTEM_DEFAULT_BY) {
    const nameList: string[] = []
    const createList: AuthEntity[] = []
    const now = new Date()
    const base = { createdBy: by, createdAt: now, updatedBy: by, updatedAt: now }
    for (let i = 0, len = createDTOList.length; i < len; i++) {
      const { name } = createDTOList[i]
      nameList.push(name)
      const id = uuid_v4()
      createList.push(em.create(AuthEntity, { id, ...createDTOList[i], ...base }))
    }
    await Promise.all([this.validateService.validateName(nameList, false, em)])
    const auths = await this.authRepo.addMany(createList, by, em)
    return auths
  }

  async deleteAuths(em: EntityManager, idList: string[], by: string = SYSTEM_DEFAULT_BY) {
    const auths = await this.getAuthsByIds(idList, false, em)
    await Promise.all([this.authRepo.deleteMany(auths, by, em)])
    return true
  }

  async updateAuths(em: EntityManager, idList: string[], updateDTOList: UpdateAuthDTO[], by: string = SYSTEM_DEFAULT_BY) {
    if (idList.length !== updateDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const auths = await this.getAuthsByIds(idList, false, em)
    const nameList: string[] = []
    for (let i = 0, len = auths.length; i < len; i++) {
      const DTO = updateDTOList[i]
      const auth = auths[i]
      const { name, remark } = DTO
      if (name) nameList.push(name)
      let hasData = false
      for (const [k, v] of Object.entries(DTO)) {
        if (isUndefined(v)) continue
        hasData = true
        if (this.columns.includes(k)) (auth as any)[k] = v
      }
      if (remark) auth.remark = remark
      if (!hasData) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    }
    await Promise.all([nameList.length > 0 ? this.validateService.validateName(nameList, false, em) : null])
    await Promise.all([this.authRepo.patch(auths, by, em)])
    return true
  }

  async updateAuthsStatus(em: EntityManager, idList: string[], updateStatusDTOList: UpdateStatusDTO[], by: string = SYSTEM_DEFAULT_BY) {
    if (idList.length !== updateStatusDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const auths = await this.getAuthsByIds(idList, false, em)
    for (let i = 0, len = auths.length; i < len; i++) {
      const updateStatusDTO = updateStatusDTOList[i]
      const auth = auths[i]
      auth.status = updateStatusDTO.status
    }
    await Promise.all([this.authRepo.patch(auths, by, em)])
    return true
  }

  async updateAuthsSort(em: EntityManager, idList: string[], updateSortDTOList: UpdateSortDTO[], by: string = SYSTEM_DEFAULT_BY) {
    if (idList.length !== updateSortDTOList.length) throw new BusinessException(ExceptionCode.COMMON_PROMPT_FOR_MODIFICATION, ExceptionCodeTextMap)
    const auths = await this.getAuthsByIds(idList, false, em)
    for (let i = 0, len = auths.length; i < len; i++) {
      const updateSortDTO = updateSortDTOList[i]
      const auth = auths[i]
      auth.sort = updateSortDTO.sort
    }
    await Promise.all([this.authRepo.patch(auths, by, em)])
    return true
  }

  async getAuths(findAllDTO: FindAllDTO, relations: boolean = false, em?: EntityManager) {
    return this.authRepo.findAll(findAllDTO, relations, em)
  }

  async getAuthsByIds(idList: string[], relations: boolean = false, em?: EntityManager) {
    const auths = await this.authRepo.findManyById(idList, relations, em)
    if (idList.length !== auths.length) throw new BusinessException(ExceptionCode.AUTH_NOT_FOUND, ExceptionCodeTextMap)
    return auths
  }

  async getAuthsByNames(nameList: string[], relations: boolean = false, em?: EntityManager) {
    const auths = await this.authRepo.findManyByName(nameList, relations, em)
    if (nameList.length !== auths.length) throw new BusinessException(ExceptionCode.AUTH_NOT_FOUND, ExceptionCodeTextMap)
    return auths
  }
}
