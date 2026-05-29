import type { CreateAuthDTO } from '../dto'
import type { AuthDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 创建认证Command */
export class CreateAuthCommand extends Command<AuthDetailsVO> {
  constructor(public readonly createAuthDTO: CreateAuthDTO) {
    super()
  }
}
