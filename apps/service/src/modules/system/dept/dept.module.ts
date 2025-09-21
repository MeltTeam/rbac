import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeptController } from './dept.controller'
import { DeptService } from './dept.service'
import { DeptEntity } from './entities/dept.entity'
import { DeptTreeEntity } from './entities/deptTree.entity'

/** 部门模块 */
@Module({
  imports: [TypeOrmModule.forFeature([DeptEntity, DeptTreeEntity])],
  controllers: [DeptController],
  providers: [DeptService],
  exports: [TypeOrmModule, DeptService],
})
export class DeptModule {}
