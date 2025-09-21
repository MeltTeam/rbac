import { Injectable } from '@nestjs/common'
import { PostVO } from './vo'

@Injectable()
export class PostService {
  async create() {
    const VO = new PostVO()
    return VO
  }
}
