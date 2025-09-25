import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from './entities/menu.entity'
import { MenuTreeEntity } from './entities/menuTree.entity'
import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'

/** 菜单模块 */
@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, MenuTreeEntity])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [TypeOrmModule, MenuService],
})
export class MenuModule {}
