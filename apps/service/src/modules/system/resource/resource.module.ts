import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResourceEntity } from './entities/resource.entity'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

/** 资源模块 */
@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [TypeOrmModule, ResourceService],
})
export class ResourceModule {}
