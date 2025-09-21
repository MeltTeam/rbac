import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleEntity } from './entities/role.entity'
import { RoleTreeEntity } from './entities/roleTree.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

/** 角色模块 */
@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RoleTreeEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [TypeOrmModule, RoleService],
})
export class RoleModule {}
