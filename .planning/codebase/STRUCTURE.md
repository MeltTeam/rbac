# Codebase Structure

**Analysis Date:** 2026-04-09

## Directory Layout

```
D:/File/Code/MeltTeam/rbac/
├── apps/                    # Application packages
│   ├── api/                 # NestJS backend API
│   ├── web/                 # Vue 3 admin frontend
│   └── uni/                 # UniApp cross-platform mobile
├── packages/                # Shared packages
│   ├── gen/                 # Plop-based code generators
│   ├── types/               # Shared TypeScript types (DTOs, VOs)
│   └── configs/             # Shared ESLint, Prettier, commitizen configs
├── .agents/                 # AI agent skill references
├── .husky/                  # Git hooks
├── .planning/               # GSD planning documents
└── docker-compose.dev.yml   # Docker dev environment
```

## Directory Purposes

**apps/api:**

- Purpose: NestJS backend with DDD+CQRS architecture
- Contains: REST API, authentication, RBAC implementation
- Key files: `src/main.ts`, `src/boot/boot.module.ts`

**apps/web:**

- Purpose: Vue 3 admin frontend
- Contains: SPA with Element Plus, Pinia, Vue Router
- Key files: `src/main.ts`, `src/routers/index.ts`

**apps/uni:**

- Purpose: UniApp cross-platform mobile application
- Contains: Mobile UI components and pages

**packages/types:**

- Purpose: Shared TypeScript type definitions
- Contains: DTOs (input), VOs (output), enums
- Key files: `src/dto/*.ts`, `src/vo/*.ts`

**packages/gen:**

- Purpose: Plop-based code generators
- Contains: Templates for business module generation

**packages/configs:**

- Purpose: Shared configuration
- Contains: ESLint, Prettier, commitizen, commitlint configs

## Key File Locations

### Backend (apps/api)

**Entry Points:**

- `apps/api/src/main.ts`: Application bootstrap
- `apps/api/src/boot/boot.module.ts`: Root module with global providers
- `apps/api/src/boot/boot.ts`: Boot implementation class

**Configuration:**

- `apps/api/src/config/`: Configuration modules (app, orm, cache, jwt, etc.)
- `apps/api/.env`: Environment configuration

**Business Modules:**

- `apps/api/src/modules/auth/`: Authentication module
- `apps/api/src/modules/rbac/user/`: User management
- `apps/api/src/modules/rbac/role/`: Role management
- `apps/api/src/modules/rbac/menu/`: Menu management
- `apps/api/src/modules/rbac/resource/`: Resource management

**Shared Infrastructure:**

- `apps/api/src/common/infra/orm/`: TypeORM (MySQL) + Mongoose (MongoDB)
- `apps/api/src/common/infra/cache/`: Redis caching
- `apps/api/src/common/infra/queue/`: BullMQ job queues
- `apps/api/src/common/infra/logging/`: Winston logging
- `apps/api/src/common/infra/email/`: Nodemailer

**Guards:**

- `apps/api/src/common/guards/auth/jwt.guard.ts`: Global JWT authentication
- `apps/api/src/common/guards/rbac/resource.guard.ts`: Resource authorization

**Filters:**

- `apps/api/src/common/filters/http-exception.filter.ts`: HTTP exception handling
- `apps/api/src/common/filters/orm-exception.filter.ts`: Database exception handling

**Decorators:**

- `apps/api/src/common/deco/auth.decorator.ts`: @IsPublic, @ResourceType, @ResourceDomain, @ResourceMethod
- `apps/api/src/common/deco/swagger.decorator.ts`: @ApiController, @ApiMethod

**Response:**

- `apps/api/src/common/vo/res.vo.ts`: Standard response format

### Frontend (apps/web)

**Entry Points:**

- `apps/web/src/main.ts`: Application bootstrap
- `apps/web/src/App.vue`: Root component

**Routing:**

- `apps/web/src/routers/index.ts`: Router configuration
- `apps/web/src/routers/guard/perm.ts`: Route guards
- `apps/web/src/routers/registry.ts`: Dynamic route registration
- `apps/web/src/routers/modules/staticRoutes.ts`: Static routes

**State Management:**

- `apps/web/src/stores/modules/user.ts`: User and auth state
- `apps/web/src/stores/modules/perm.ts`: Permission state

**API Client:**

- `apps/web/src/apis/`: Auto-generated from Swagger via openapi-ts-request

**Views:**

- `apps/web/src/views/`: Page components

**Components:**

- `apps/web/src/components/`: Reusable components

**Utilities:**

- `apps/web/src/utils/`: Helper functions

### Shared Types (packages/types)

**DTOs (Input):**

- `packages/types/src/dto/IAuth.dto.ts`: Auth input types
- `packages/types/src/dto/IUser.dto.ts`: User input types
- `packages/types/src/dto/IRole.dto.ts`: Role input types
- `packages/types/src/dto/IMenu.dto.ts`: Menu input types

**VOs (Output):**

- `packages/types/src/vo/IAuth.vo.ts`: Auth response types
- `packages/types/src/vo/IUser.vo.ts`: User response types
- `packages/types/src/vo/IRole.vo.ts`: Role response types
- `packages/types/src/vo/IMenu.vo.ts`: Menu response types

**Enums:**

- `packages/types/src/enums/`: Resource types, status codes, etc.

## Naming Conventions

**Files:**

- Entity: `{name}.entity.ts` (e.g., `auth.entity.ts`)
- Repository interface: `I{Name}Repository.ts` (e.g., `IAuthRepository.ts`)
- Repository impl: `{name}.repository.ts` (e.g., `auth.repository.ts`)
- Command: `{action}-{entity}.command.ts` (e.g., `login.command.ts`)
- Handler: `{action}-{entity}.handler.ts` (e.g., `login.handler.ts`)
- Query: `get-{entities}.query.ts` (e.g., `get-menus.query.ts`)
- DTO: `{action}-{entity}.dto.ts` or `{entity}-id.dto.ts`
- VO: `{entity}.vo.ts` or `{entity}-details.vo.ts`
- Module: `{name}.module.ts` (e.g., `auth.module.ts`)
- Guard: `{name}.guard.ts` (e.g., `jwt.guard.ts`)
- Filter: `{name}.filter.ts` (e.g., `http-exception.filter.ts`)
- Decorator: `{name}.decorator.ts` (e.g., `auth.decorator.ts`)

**Directories:**

- Module directory: kebab-case (e.g., `auth/`, `rbac/`)
- Layer directories: lowercase (app/, domain/, infra/, iface/)
- Subdirectories: plural for collections (commands/, queries/, entities/)

**Classes/Interfaces:**

- Entity class: PascalCase with Entity suffix (e.g., `AuthEntity`)
- Repository interface: `I{Name}Repository` (e.g., `IAuthRepository`)
- Domain service interface: `I{Name}DomainService`
- Command class: PascalCase with Command suffix (e.g., `LoginCommand`)
- Handler class: PascalCase with Handler suffix (e.g., `LoginHandler`)

## Where to Add New Code

**New Feature (Backend):**

1. Run `pnpm g:bm` in apps/api to generate module scaffold
2. Implement in order:
   - VO/DTO in `packages/types/src/vo/` and `packages/types/src/dto/`
   - Entity in `src/modules/{module}/domain/entities/impl/`
   - Repository interface in `src/modules/{module}/domain/repo/`
   - Repository implementation in `src/modules/{module}/infra/repo/`
   - Domain Service in `src/modules/{module}/domain/services/impl/`
   - Commands/Queries in `src/modules/{module}/app/commands/` and `queries/`
   - Controller in `src/modules/{module}/iface/controllers/impl/`
3. Run `pnpm g:swag` to update Swagger metadata

**New Feature (Frontend):**

1. Generate API client: `pnpm g:api` in apps/web
2. Add types in `packages/types/src/`
3. Create view in `apps/web/src/views/`
4. Add route in `apps/web/src/routers/modules/`
5. Add store if needed in `apps/web/src/stores/modules/`

**New Component (Frontend):**

- Implementation: `apps/web/src/components/`
- Auto-imported via unplugin-vue-components

**New Guard (Backend):**

- Implementation: `apps/api/src/common/guards/auth/` or `apps/api/src/common/guards/rbac/`
- Register in module providers

**New Filter (Backend):**

- Implementation: `apps/api/src/common/filters/`
- Register in `BootModule` global providers

**New Decorator (Backend):**

- Implementation: `apps/api/src/common/deco/`
- Export from `apps/api/src/common/deco/index.ts`

**New Infrastructure Module:**

- Implementation: `apps/api/src/common/infra/{name}/`
- Import in `BootModule` infrastructureModule array

## Special Directories

**apps/api/db:**

- Purpose: Database migrations or seeds (if any)
- Generated: No
- Committed: Yes

**apps/api/public:**

- Purpose: Static files served by NestJS
- Generated: No
- Committed: Yes

**apps/web/src/apis:**

- Purpose: Auto-generated API client from Swagger
- Generated: Yes (via openapi-ts-request)
- Committed: Yes

**.turbo:**

- Purpose: Turborepo build cache
- Generated: Yes
- Committed: No (in .gitignore)

**node_modules:**

- Purpose: Package dependencies
- Generated: Yes (via pnpm install)
- Committed: No (in .gitignore)

---

_Structure analysis: 2026-04-09_
