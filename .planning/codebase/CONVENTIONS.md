# Coding Conventions

**Analysis Date:** 2026-04-09

## Naming Patterns

**Files:**

- TypeScript files: `kebab-case.ts` (e.g., `auth.controller.ts`, `login.handler.ts`)
- Vue components: `PascalCase/index.vue` (e.g., `MButton/index.vue`, `MThemeBtn/index.vue`)
- Test files: `*.spec.ts` (e.g., `jwt.guard.spec.ts`)
- Barrel files: `index.ts` for module exports

**Classes:**

- Controllers: `PascalCase` + `Controller` suffix (e.g., `AuthController`)
- Services: `PascalCase` + `Service` suffix (e.g., `LoggingService`, `AuthDomainService`)
- Entities: `PascalCase` + `Entity` suffix (e.g., `AuthEntity`, `CommonEntity`)
- Handlers: `PascalCase` + `Handler` suffix (e.g., `LoginHandler`)
- Guards: `PascalCase` + `Guard` suffix (e.g., `JwtGuard`)
- DTOs: `PascalCase` + `DTO` suffix (e.g., `CreateAuthDTO`, `EmailLoginDTO`)
- VOs: `PascalCase` + `VO` suffix (e.g., `TokenVO`, `ResVO`)

**Variables:**

- camelCase for local variables and parameters (e.g., `findAllDTO`, `authIdDTO`)
- UPPER_SNAKE_CASE for constants (e.g., `IS_PUBLIC_KEY`, `REFRESH_KEY`)
- \_underscore prefix for private/internal state (e.g., `_userInfo`, `_access` in Pinia stores)

**Types/Interfaces:**

- Interface names: `I` prefix + `PascalCase` (e.g., `IAuthEntity`, `IAuthDomainService`, `IHttpUtils`)
- Type aliases: `PascalCase` with `T` prefix for utility types (e.g., `TLoginType`)

## Code Style

**Formatting:**

- Tool: Prettier with shared config `@configs/prettier-config`
- Key settings from `packages/configs/prettier-config/src/index.mjs`:
  - `semi: false` (no semicolons)
  - `singleQuote: true` (single quotes for strings)
  - `printWidth: 150` (max line width 150 characters)

**Linting:**

- Tool: ESLint with `@antfu/eslint-config` as base
- Project-specific configs in `packages/configs/eslint-config/src/`:
  - `base.mjs` - Shared base config (Vue, TypeScript, YAML, test support)
  - `api.mjs` - Backend API config (NestJS)
  - `web.mjs` - Frontend web config (Vue, UnoCSS)
  - `uni.mjs` - UniApp mobile config
- Key rules disabled:
  - `style/operator-linebreak: off`
  - `style/arrow-parens: off`
  - `style/brace-style: off`
  - `antfu/if-newline: off`
  - `no-console: off` (API only)

## Import Organization

**Order:**

1. Node.js built-in modules (e.g., `import { pid } from 'node:process'`)
2. External packages (e.g., `import { Injectable } from '@nestjs/common'`)
3. Internal aliases using `@/` (e.g., `import { LoggingService } from '@/common/infra'`)
4. Relative imports (e.g., `import { LoginCommand } from './login.command'`)

**Path Aliases:**

- Backend (`apps/api`): `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Frontend (`apps/web`): `@/*` maps to `./src/*` (configured in `tsconfig.app.json`)
- Shared packages: `@packages/types`, `@configs/eslint-config`, `@configs/prettier-config`

## Error Handling

**Patterns:**

- Centralized exception codes in `apps/api/src/common/exceptions/exception-code.ts`
- Enum `ExceptionCode` defines all error codes with module prefix (e.g., `AUTH_0000`, `USER_0001`)
- `ExceptionCodeTextMap` maps codes to Chinese messages and HTTP status

**Response Format:**

- Unified response via `ResVO<T>` class in `apps/api/src/common/vo/res.vo.ts`
- Structure: `{ code: string, msg: string, data: T, originUrl, referer, userAgent, timestamp, clientIp }`
- Success: `code: '0'`, Error: code from `ExceptionCode` enum

**Business Errors:**

- Use `HttpStatus.OK` (200) for expected business validation failures
- Use appropriate HTTP status codes for system errors (400, 401, 403, 404, 500)

## Logging

**Framework:** Winston via `LoggingService` in `apps/api/src/common/infra/logging/logging.service.ts`

**Patterns:**

```typescript
// Inject LoggingService and use methods
this.loggingService.debug(message, context?)
this.loggingService.log(message, context?)
this.loggingService.warn(message, context?)
this.loggingService.error(message, trace?, context?)
```

**Log Context:**

- Use `@LogContextClass()` decorator to set class context
- Use `@LogContextMethod()` decorator to set method context
- Logs are queued via BullMQ when Redis is available, otherwise written directly

## Comments

**When to Comment:**

- JSDoc-style comments for public APIs, classes, and interfaces
- Chinese comments are used throughout the codebase

**JSDoc/TSDoc:**

```typescript
/** 登录Command */
export class LoginCommand extends Command<TokenVO> { ... }

/**
 * 构建成功响应体
 * @param data 响应数据
 * @param clsService 上下文服务
 */
public static success<T = any>(data: T, clsService: ClsService): ResVO<T> { ... }
```

## Function Design

**Size:** Keep functions focused and single-purpose

**Parameters:**

- Use DTO classes for complex inputs (e.g., `CreateAuthDTO`, `FindAllDTO`)
- Use destructuring for optional parameters
- Use `readonly` modifier for immutable parameters in commands

**Return Values:**

- Return `Promise<T>` for async operations
- Use VO classes for structured responses (e.g., `TokenVO`, `AuthDetailsVO`)
- Return `boolean` for success/failure operations

## Module Design

**Exports:**

- Use barrel files (`index.ts`) to re-export module contents
- Example from `apps/api/src/modules/auth/app/index.ts`:

```typescript
export * from './assemblers'
export * from './commands'
export * from './dto'
export * from './queries'
export * from './vo'
```

**Barrel Files:**

- Used extensively for clean imports
- Each module layer has its own `index.ts`
- Import from barrel: `import { LoginCommand, TokenVO } from '../../../app'`

**NestJS Module Structure (DDD + CQRS):**

- `app/` - Application layer (commands, queries, services, DTOs, VOs, assemblers, strategies)
- `domain/` - Domain layer (entities, services, repositories, events)
- `infra/` - Infrastructure layer (repository implementations)
- `iface/` - Interface layer (controllers)

**Vue/Store Structure:**

- Pinia stores use `defineStore()` with state, getters, actions
- Private state prefixed with `_`, exposed via getters
- Example from `apps/web/src/stores/modules/user.ts`:

```typescript
export const userStore = defineStore('USER', {
  state: (): IUserState => ({ _userInfo: null, _access: null, _refresh: null }),
  getters: {
    userInfo: (state) => state._userInfo,
    access: (state) => state._access,
  },
  actions: {
    async login(type: 'svg' | 'email', DTO: SvgLoginDTO | EmailLoginDTO) { ... }
  },
})
```

---

_Convention analysis: 2026-04-09_
