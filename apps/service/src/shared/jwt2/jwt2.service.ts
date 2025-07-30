import type { Response as ExpressResponse } from 'express'
import type Redis from 'ioredis'
import type { IJwt2Service, IRedisToken, ISetRedisTokenOptions, TokenType } from './interfaces/IJwt2Service'
import type { UserInfo } from '@/modules/auth/vos/login.vo'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LikeCache2Module } from '../cache2/LikeCache2Module.abstract'
import { JWT_REDIS_CLIENT_TOKEN } from './constants'

@Injectable()
export class Jwt2Service extends LikeCache2Module implements IJwt2Service {
  constructor(
    @Inject(CACHE_MANAGER) memory: Cache,
    @Inject(JWT_REDIS_CLIENT_TOKEN) redis: Redis,
    private readonly jwtService: JwtService,
  ) {
    super({
      className: Jwt2Service.name,
      redis,
      memory,
    })
  }

  async generatePayload(userInfo: UserInfo, tokenType: TokenType) {
    const payload = {
      id: userInfo.id,
      username: userInfo.name,
      tokenType,
    }
    return payload
  }

  async generateToken(userInfo: UserInfo, expiresIn: string, secret: string, tokenType: TokenType) {
    const payload = await this.generatePayload(userInfo, tokenType)
    return await this.jwtService.signAsync(payload, {
      expiresIn,
      secret,
    })
  }

  async setCookieToken(res: ExpressResponse, key: string, value: string, maxAge: number) {
    res.cookie(key, value, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
    })
  }

  async delCookieToken(res: ExpressResponse, key: TokenType) {
    res.clearCookie(key, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })
  }

  async setRedisToken(setRedisTokenOptions: ISetRedisTokenOptions) {
    const { userId, refreshToken, accessToken, ttl } = setRedisTokenOptions
    const redisToken: IRedisToken = {
      refreshToken,
      accessToken,
    }
    return await this.set(userId, redisToken, ttl)
  }

  async delRedisToken(userId: string) {
    return await this.del(userId)
  }

  // async validateRefreshToken(token: string, secret?: string | Buffer<ArrayBufferLike>) {
  //   const { tokenType, ...userInfo } = await this.jwtService.verifyAsync<IPayLoad>(token, {
  //     secret,
  //   })
  //   if (tokenType !== 'refreshToken') throw new HttpException('令牌类型错误', HttpStatus.INTERNAL_SERVER_ERROR)
  //   const redisToken = await this.get<IRedisToken>(userInfo.id)
  //   if (redisToken?.refreshToken !== token) throw new HttpException('刷新令牌解析错误', HttpStatus.INTERNAL_SERVER_ERROR)
  //   return userInfo
  // }
}
