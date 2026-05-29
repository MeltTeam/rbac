import type { CreateResourceDTO } from '../dto'
import type { ResourceDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 创建资源Command */
export class CreateResourceCommand extends Command<ResourceDetailsVO> {
  constructor(public readonly createResourceDTO: CreateResourceDTO) {
    super()
  }
}
