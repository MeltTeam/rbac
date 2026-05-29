# CLAUDE.md — apps/api

NestJS 后端，DDD + CQRS 架构。入口 `src/main.ts` → `BootImpl.create(BootModule)`。

## 常用命令

```bash
pnpm dev           # HMR 开发服务器（ENV_NAME=dev + webpack watch）
pnpm build         # nest build
pnpm g:bm          # Plop 生成业务模块 + 刷新 Swagger 元数据
pnpm g:swag        # 仅刷新 Swagger 元数据（generate-metadata.ts）
pnpm test          # Jest 单元测试（@swc/jest 转译，匹配 *.spec.ts）
pnpm test:watch    # Jest watch 模式
pnpm test:cov      # Jest 覆盖率
pnpm test:e2e      # E2E 测试（test/jest-e2e.json）
pnpm lint          # format + eslint 检查
pnpm lint:fix      # format + eslint 修复
```

## DDD 模块结构

业务模块组织为 `src/modules/auth`（认证）+ `src/modules/rbac/`（权限，含 menu/resource/role/user 四个子模块）。

每个业务模块遵循四层架构：

```
module/
├── domain/          # 领域层：实体（interface+impl）、领域事件、仓储接口、领域服务
├── app/             # 应用层：CQRS Command/Query + Handler、DTO、VO、Assembler
├── iface/           # 接口层：Controller（interface+impl），注入 CommandBus/QueryBus
└── infra/           # 基础设施层：仓储实现、Token 实现等
```

- Controller 通过 `commandBus.execute(new XxxCommand(dto))` / `queryBus.execute(new XxxQuery(dto))` 分发
- Command/Query 类继承 `Command<T>` / `Query<T>`，Handler 实现 `ICommandHandler` / `IQueryHandler`
- 模块注册模式见 `menu.module.ts`：entities → TypeOrmModule.forFeature，providers 分 commandHandlers / queryHandlers / eventHandlers / services / repo

## 关键架构

### 启动流程

`BootImpl.create()` → `boot.init()`（全局设置、中间件、管道、初始化数据、Swagger）→ `boot.enableHotReload()` → `boot.listen()`

### 全局守卫链（boot.module.ts）

`ThrottlerGuard` → `JwtGuard` → `ResourceGuard`（RBAC 资源权限，基于 `@ResourceType` / `@ResourceDomain` / `@ResourceMethod` 装饰器元数据）

### 全局拦截器

`HttpInterceptor`：响应统一包装为 `ResVO`（code/msg/data + 请求上下文信息），`@NoFormat()` 跳过包装

### 全局过滤器

`UnknownExceptionFilter` → `OrmExceptionFilter` → `CacheExceptionFilter` → `HttpExceptionFilter`

### 自定义装饰器（common/deco/）

- `@IsPublic()` — 跳过 JWT 验证
- `@ResourceType()` / `@ResourceDomain()` / `@ResourceMethod()` — RBAC 资源权限标记
- `@ApiMethod()` / `@ApiController()` — Swagger 装饰器融合
- `@LogContextClass()` / `@LogContextMethod()` — 日志上下文自动注入
- `@NoFormat()` — 跳过响应包装
- `@CacheKey()` / `@CacheClear()` — 缓存操作
- 自定义验证装饰器（`validator.decorator.ts`）

### 仓储模板（common/template/）

- `CrudRepositoryTemplate<T>` — 通用 CRUD（addMany/deleteMany/patch/findAll/findManyById 等）
- `ManyToManyRepositoryTemplate<T>` — 多对多关系
- `TreeRepositoryTemplate<T>` — 树形结构

### 实体基类

`CommonEntity`（extends `AggregateRoot`）：\_id(int 自增主键)、id(uuid varchar 36)、createdBy/updatedBy/deletedBy(varchar 36)、createdAt/updatedAt/deletedAt(datetime, 软删除)、status(StatusEnum)、sort(SortEnum)、remark(varchar nullable)。BeforeInsert/BeforeUpdate/BeforeSoftRemove 自动填充。

### 配置系统

`ConfigModule`（全局）：`@nestjs/config` + Joi 校验，env 文件优先级 `.env.local` > `.env.{ENV_NAME}` > `.env`。配置项见 `src/config/` 下各子模块（app/base/cache/cors/email/helmet/http/jwt/orm/queue/swagger/throttler/winston），每个子模块含 config.ts + ValidationSchema.ts + IValidationSchema.ts。

### 基础设施（common/infra/）

- `OrmModule` — TypeORM（MySQL）+ Mongoose（MongoDB）
- `CacheModule` — ioredis/Valkey + cache-manager + BullMQ processor
- `LoggingModule` — winston + winston-mongodb（日志双写文件+MongoDB）
- `QueueModule` — BullMQ 队列
- `EmailModule` — nodemailer + hbs 模板
- `ThrottlerModule` — 限流 + Redis 存储
- `HttpModule` — @nestjs/axios
- `CtxModule` — nestjs-cls 请求上下文

### Swagger

`@scalar/nestjs-api-reference` + `@nestjs/swagger`。元数据通过 `g:swag` 脚本生成到 `src/metadata.ts`。

## 代码生成

`pnpm g:bm` 调用 `@packages/gen` 的 `api.mjs` plopfile，交互式生成完整 DDD 模块（domain/app/iface/infra 四层所有文件），然后自动刷新 Swagger 元数据。

## 路径别名

`@/` → `src/`（tsconfig + Jest moduleNameMapper）
