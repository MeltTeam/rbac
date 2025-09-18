import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'

export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.warn('JwtGuard')
    return super.canActivate(context)
  }
}
