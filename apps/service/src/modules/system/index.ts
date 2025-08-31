import { AuthModule } from '@auth/auth.module'
import { UserModule } from '@user/user.module'

export const SystemModule = [UserModule, AuthModule]
