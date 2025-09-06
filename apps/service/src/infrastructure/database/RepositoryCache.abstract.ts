// import type { Cache2Service } from '@cache2/cache2.service'
// import type { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm'
// import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
// import { BaseModule } from '@abstracts/index'
// import { DB_NULL } from '@constants/index'
// import { uuid_v4 } from '@utils/index'

// export interface RepositoryCacheOptions<RepositoryEntity extends ObjectLiteral> {
//   /** 子类名 */
//   className: string
//   /** 数据库操作对象 */
//   repository: Repository<RepositoryEntity>
//   /** 缓存服务 */
//   cacheService: Cache2Service
// }
// /** 缓存条件类型 */
// export type TCacheObj<T extends ObjectLiteral> = FindOptionsWhere<T> | T | (() => string) | QueryDeepPartialEntity<T>
// export abstract class RepositoryCache<RepositoryEntity extends ObjectLiteral> extends BaseModule {
//   /** 需要缓存的字段 */
//   abstract cacheKeys: Array<keyof RepositoryEntity>
//   /** 数据库操作对象 */
//   repository: Repository<RepositoryEntity>
//   /** 缓存服务 */
//   cacheService: Cache2Service

//   constructor(cacheRepositoryOptions: RepositoryCacheOptions<RepositoryEntity>) {
//     const { className, repository, cacheService } = cacheRepositoryOptions
//     super(className)
//     this.cacheService = cacheService
//     this.repository = repository
//     this._className = className
//   }

//   /**
//    * 设置缓存
//    * @param obj 缓存条件
//    * @param result 要缓存数据
//    * @param cacheKeys 需要缓存的字段
//    * @param ttl 过期时间(default: 3 * 60 * 1000)
//    * @param repositoryName 存储库名(default: this._className)
//    */
//   async setCache<Entity extends ObjectLiteral>(
//     obj: TCacheObj<Entity> | 'ALL',
//     result: Entity | Entity[] | null,
//     cacheKeys: Array<keyof Entity>,
//     ttl: number = 3 * 60 * 1000,
//     repositoryName: string = this._className!,
//   ) {
//     // 用UUID找缓存数据
//     const UUID = uuid_v4()
//     // 有没有结果都会存
//     this.cacheService.set(UUID, result || DB_NULL, ttl)
//     if (obj === 'ALL') {
//       const _key = `ALL:${repositoryName}`
//       this.cacheService.set(_key, UUID, ttl)
//     } else {
//       // 记录与缓存数据有关联的缓存key
//       const keys: Array<string> = []
//       // 缓存条件中需要缓存的字段
//       for (const cacheKey of cacheKeys) {
//         const value = obj[cacheKey as string]
//         if (!value) continue
//         // 存储库名:缓存字段名:缓存字段值
//         const _key = `${repositoryName}:${cacheKey as string}:${value}`
//         keys.push(_key)
//         // 缓存单个缓存字段名和UUID的关系
//         this.cacheService.set(_key, UUID, ttl)
//       }
//       // 缓存单个缓存数据与多个缓存key的关系(用于删除缓存时把关联的所有缓存删除)
//       if (keys.length !== 0) this.cacheService.set(`D:${UUID}`, keys, ttl)
//     }
//   }

//   /**
//    * 删除缓存
//    * @param obj 缓存条件
//    * @param cacheKeys 需要缓存的字段
//    * @param isDelay 是否延迟删除(default: true)
//    * @param delay 延迟时间(default: 1000)
//    * @param repositoryName 存储库名(default: this._className)
//    */
//   async delCache<Entity extends ObjectLiteral>(
//     obj: TCacheObj<Entity> | 'ALL',
//     cacheKeys: Array<keyof Entity>,
//     isDelay: boolean = true,
//     delay: number = 1000,
//     repositoryName: string = this._className!,
//   ) {
//     if (obj === 'ALL') {
//       const _key = `ALL:${repositoryName}`
//       const UUID = await this.cacheService.get<string>(_key)
//       if (UUID) isDelay ? await this.cacheService.delayedDel(UUID, delay) : await this.cacheService.del(UUID)
//     } else {
//       // 缓存条件中需要缓存的字段
//       for (const cacheKey of cacheKeys) {
//         const value = obj[cacheKey as string]
//         if (!value) continue
//         // 储存库名:缓存字段名:缓存字段值
//         const _key = `${repositoryName}:${cacheKey as string}:${value}`
//         const UUID = await this.cacheService.get<string>(_key)
//         if (!UUID) continue
//         isDelay ? await this.cacheService.delayedDel(UUID, delay) : await this.cacheService.del(UUID)
//         // 删除相关联的缓存
//         const keys = await this.cacheService.get<string[]>(`D:${UUID}`)
//         if (!keys) continue
//         for (const key of keys) {
//           isDelay ? await this.cacheService.delayedDel(key, delay) : await this.cacheService.del(key)
//         }
//         isDelay ? await this.cacheService.delayedDel(`D:${UUID}`, delay) : await this.cacheService.del(`D:${UUID}`)
//       }
//     }
//   }

//   /**
//    *
//    * @param obj 缓存条件
//    * @param cacheKeys 需要缓存的字段
//    * @param repositoryName 存储库名(default: this._className)
//    */
//   async getCache<Entity extends ObjectLiteral, T extends Entity | Entity[] = Entity>(
//     obj: TCacheObj<Entity> | 'ALL',
//     cacheKeys: Array<keyof Entity>,
//     repositoryName: string = this._className!,
//   ) {
//     if (obj === 'ALL') {
//       const _key = `ALL:${repositoryName}`
//       const UUID = await this.cacheService.get<string>(_key)
//       if (UUID) {
//         const cache = await this.cacheService.get<T | typeof DB_NULL>(UUID)
//         return cache === DB_NULL ? null : cache
//       }
//     } else {
//       // 缓存条件中需要缓存的字段
//       for (const cacheKey of cacheKeys) {
//         const value = obj[cacheKey as string]
//         if (!value) continue
//         const _key = `${repositoryName}:${cacheKey as string}:${value}`
//         const UUID = await this.cacheService.get<string>(_key)
//         if (!UUID) continue
//         // 根据UUID找缓存数据
//         const cache = await this.cacheService.get<T | typeof DB_NULL>(UUID)
//         return cache === DB_NULL ? null : cache
//       }
//     }
//     // 缓存条件中没有需要缓存的字段
//     return null
//   }
// }
