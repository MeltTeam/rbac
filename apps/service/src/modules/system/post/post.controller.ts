import type { IPostController } from './IPost'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiController, ApiMethod } from '@/common/decorators/swagger.decorator'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { PostService } from './post.service'
import { PostVO } from './vo'

@Controller('post')
@ApiController({ ApiTagsOptions: ['岗位模块'] })
export class PostController implements IPostController {
  constructor(private readonly postService: PostService) {}
  @UseGuards(JwtGuard)
  @Post()
  @ApiMethod({
    ApiOperationOptions: [{ summary: '创建岗位' }],
    ApiResponseOptions: [{ type: PostVO }],
    ApiBearerAuthOptions: 'JWT',
  })
  async create() {
    return await this.postService.create()
  }
}
