import type { IAuthService } from './IAuth'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService implements IAuthService {}
