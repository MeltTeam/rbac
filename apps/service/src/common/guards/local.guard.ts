import type { ExecutionContext } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { AuthGuard } from '@nestjs/passport'

export class LocalGuard extends AuthGuard('local') {
  constructor() {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.warn('LocalGuard')
    return super.canActivate(context)
  }
}
