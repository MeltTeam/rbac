# Architecture

**Analysis Date:** 2026-04-09

## Pattern Overview

**Overall:** Domain-Driven Design (DDD) with CQRS pattern

**Key Characteristics:**

- Layered architecture with clear separation of concerns
- Command Query Responsibility Segregation (CQRS) for write/read operations
- Monorepo structure with shared types package
- Resource-based authorization with decorators

## Layers

**Interface Layer (iface):**

- Purpose: HTTP request handling, input validation, response formatting
- Location: `apps/api/src/modules/{module}/iface/controllers/`
- Contains: REST controllers with Swagger decorators
- Depends on: Application layer (CommandBus, QueryBus)
- Used by: External HTTP clients

**Application Layer (app):**

- Purpose: Orchestration of use cases, DTO/VO transformation
- Location: `apps/api/src/modules/{module}/app/`
- Contains: Commands, Queries, Handlers, Services, Assemblers, DTOs, VOs, Strategies
- Depends on: Domain layer (Domain Services, Repository interfaces)
- Used by: Interface layer

**Domain Layer (domain):**

- Purpose: Business logic, entity definitions, repository interfaces
- Location: `apps/api/src/modules/{module}/domain/`
- Contains: Entities, Domain Services, Repository Interfaces, Events, Constants
- Depends on: Nothing (pure business logic)
- Used by: Application layer, Infrastructure layer

**Infrastructure Layer (infra):**

- Purpose: Technical implementation of repositories and external services
- Location: `apps/api/src/modules/{module}/infra/` and `apps/api/src/common/infra/`
- Contains: Repository implementations, Token services, External integrations
- Depends on: Domain layer (implements interfaces), External packages
- Used by: Application layer

## Data Flow

**Request Flow:**

1. HTTP Request hits Controller (Interface layer)
2. Global Guards execute in order: ThrottlerGuard → JwtGuard → ResourceGuard
3. Controller dispatches Command/Query via CommandBus/QueryBus
4. Handler (Application layer) receives Command/Query
5. Handler calls Domain Service for business logic
6. Domain Service uses Repository interface for persistence
7. Repository implementation (Infrastructure layer) executes database operations
8. Handler uses Assembler to transform result to VO
9. HttpInterceptor formats response as ResVO

**State Management (Frontend):**

- Pinia stores manage client-side state
- `userStore` handles authentication state (access/refresh tokens)
- `permStore` manages roles, menus, buttons, components
- Dynamic routes registered based on server response

## Key Abstractions

**Command (Write Operations):**

- Purpose: Encapsulate write operation intent
- Examples: `apps/api/src/modules/auth/app/commands/login.command.ts`
- Pattern: `LoginCommand` → `LoginHandler` → `AuthDomainService.login()`

**Query (Read Operations):**

- Purpose: Encapsulate read operation intent
- Examples: `apps/api/src/modules/auth/app/queries/get-me-info.query.ts`
- Pattern: `GetMeInfoQuery` → `GetMeInfoHandler` → Data retrieval

**Repository:**

- Purpose: Abstract data persistence
- Examples: `apps/api/src/modules/auth/domain/repo/IAuthRepository.ts`
- Pattern: Interface in domain, implementation in infra extending `CrudRepositoryTemplate`

**Entity:**

- Purpose: Represent domain objects with identity
- Examples: `apps/api/src/modules/auth/domain/entities/impl/auth.entity.ts`
- Pattern: Extend `CommonEntity`, use TypeORM decorators

**Value Object (VO):**

- Purpose: Data transfer objects for API responses
- Examples: `packages/types/src/vo/IAuth.vo.ts`
- Pattern: Shared types in `packages/types` for frontend/backend consistency

## Entry Points

**Backend Entry:**

- Location: `apps/api/src/main.ts`
- Triggers: Application startup
- Responsibilities: Create BootImpl, initialize, enable HMR, listen

**Boot Process:**

- Location: `apps/api/src/boot/boot.ts`
- Responsibilities:
  1. Create NestFactory instance
  2. Replace default logger with LoggingService
  3. Initialize global settings, middlewares, pipes
  4. Initialize resources, menus, roles, users (seed data)
  5. Initialize Swagger documentation
  6. Start HTTP server

**Frontend Entry:**

- Location: `apps/web/src/main.ts`
- Triggers: Browser page load
- Responsibilities:
  1. Create Vue app
  2. Setup Pinia (state)
  3. Setup i18n (internationalization)
  4. Setup Vue Router
  5. Install plugins
  6. Mount to DOM

## Error Handling

**Strategy:** Layered exception filters with fallback

**Patterns:**

- Global filters chain: `UnknownExceptionFilter` → `OrmExceptionFilter` → `CacheExceptionFilter` → `HttpExceptionFilter`
- `BusinessException` for domain-specific errors with custom codes
- `ResVO.error()` for consistent error response format
- Error codes defined in `apps/api/src/common/exceptions/exception-code.ts`

## Cross-Cutting Concerns

**Logging:** Winston-based LoggingService with MongoDB transport for persistent logs

- Location: `apps/api/src/common/infra/logging/`
- Context-aware logging via `LogContextClass` decorator

**Validation:** class-validator with custom decorators

- Location: `apps/api/src/common/deco/validator.decorator.ts`
- DTOs use validation decorators

**Authentication:** JWT with Passport strategies

- Strategies: jwt, svg-login, email-login, phone-login, refresh-token, email-register, email-reset-pwd
- Guards: JwtGuard (global), strategy-specific guards for public endpoints

**Authorization:** Resource-based with decorators

- `@ResourceType()` - API/MENU/BUTTON
- `@ResourceDomain()` - AUTH, USER, ROLE, etc.
- `@ResourceMethod()` - create, update, delete, list, detail

**Rate Limiting:** ThrottlerGuard with configurable limits

- Location: `apps/api/src/common/infra/throttler/`

**Caching:** Redis-based CacheService

- Location: `apps/api/src/common/infra/cache/`
- Template-based CRUD cache operations

**Request Context:** nestjs-cls for request-scoped data

- Middleware: `CtxMiddleware` extracts client IP, user agent, etc.
- Available via `ClsService` throughout request lifecycle

---

_Architecture analysis: 2026-04-09_
