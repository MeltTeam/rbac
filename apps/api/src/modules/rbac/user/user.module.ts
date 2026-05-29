import type { ModuleMetadata } from '@nestjs/common'
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleModule } from '../role/role.module'
import {
  CreateUserHandler,
  DeleteUserHandler,
  GetRoleByUserHandler,
  GetUserByIdHandler,
  GetUserByRoleHandler,
  GetUsersHandler,
  ReplaceUserRoleHandler,
  ReplaceUsersRoleHandler,
  UpdateUserHandler,
  UpdateUserSortHandler,
  UpdateUserStatusHandler,
  UserRoleService,
} from './app'
import { UserDomainListener, UserDomainService, UserEntity, UserProfileEntity, UserValidateService } from './domain'
import { UserController, UserRoleController } from './iface/controllers'
import { UserProfileRepository, UserRepository, UserRoleRepository } from './infra/repo'

/** 实体 */
const entities: EntityClassOrSchema[] = [UserEntity, UserProfileEntity]
/** 控制器 */
const controllers: ModuleMetadata['controllers'] = [UserController, UserRoleController]
/** 命令处理 */
const commandHandlers: ModuleMetadata['providers'] = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
  UpdateUserSortHandler,
  UpdateUserStatusHandler,
  ReplaceUserRoleHandler,
  ReplaceUsersRoleHandler,
]
/** 查询处理 */
const queryHandlers: ModuleMetadata['providers'] = [GetUsersHandler, GetUserByIdHandler, GetRoleByUserHandler, GetUserByRoleHandler]
/** 事件处理 */
const eventHandlers: ModuleMetadata['providers'] = [UserDomainListener]
/** 服务 */
const services: ModuleMetadata['providers'] = [UserValidateService, UserDomainService, UserRoleService]
/** 仓库 */
const repo: ModuleMetadata['providers'] = [UserRepository, UserProfileRepository, UserRoleRepository]
/** 用户模块 */

@Module({
  imports: [TypeOrmModule.forFeature(entities), RoleModule],
  controllers,
  providers: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
  exports: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class UserModule {}
