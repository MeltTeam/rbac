import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostEntity } from './entities/post.entity'
import { PostController } from './post.controller'
import { PostService } from './post.service'

/** 岗位模块 */
@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule, PostService],
})
export class PostModule {}
