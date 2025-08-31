import type { IRegisterByEmailDTO } from '@packages/types'
import { LoginByEmailDTO } from './loginByEmail.dto'

export class RegisterByEmailDTO extends LoginByEmailDTO implements IRegisterByEmailDTO {}
