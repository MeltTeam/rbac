# Technology Stack

**Analysis Date:** 2026-04-09

## Languages

**Primary:**

- TypeScript 5.8 - Used across all apps and packages

**Secondary:**

- None - TypeScript is the sole development language

## Runtime

**Environment:**

- Node.js 20.19.2 - Specified in `.nvmrc` and `package.json` engines

**Package Manager:**

- pnpm 9.5.0 - Workspace-based monorepo management
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**

- NestJS 10.4.20 - Backend API framework with DDD/CQRS architecture
- Vue 3.4.21 - Frontend framework
- UniApp 3.0.0-4080720251210001 - Cross-platform mobile development
- Turborepo 2.5.4 - Monorepo build orchestration

**Testing:**

- Jest 29.7.0 - Unit testing (API)
- Jest 27.0.4 - Unit testing (UniApp)
- @nestjs/testing 10.4.20 - NestJS testing utilities
- supertest 7.0.0 - E2E API testing

**Build/Dev:**

- Vite 5.2.8 - Frontend build tool (web and uni apps)
- webpack 5.99.9 - Backend build (NestJS)
- SWC 1.15.8 - Fast TypeScript compilation
- Rollup 4.44.2 - Types package bundling

## Key Dependencies

**Critical (Backend):**

- `@nestjs/core` 10.4.20 - NestJS core framework
- `@nestjs/cqrs` 11.0.3 - CQRS pattern implementation
- `typeorm` 0.3.20 - MySQL ORM
- `mongoose` 8.23.0 - MongoDB ODM (for logging)
- `@nestjs/passport` 11.0.5 - Authentication framework
- `@nestjs/jwt` 10.2.0 - JWT token handling
- `bullmq` 5.54.0 - Job queue processing
- `ioredis` 5.6.1 - Redis client
- `winston` 3.17.0 - Logging framework

**Critical (Frontend):**

- `vue-router` 4.5.1 - Vue routing
- `pinia` 2.2.4 - State management
- `element-plus` 2.9.11 - UI component library
- `axios` 1.10.0 - HTTP client
- `@vueuse/core` 11.3.0 - Vue composition utilities
- `unocss` 66.1.4 - Atomic CSS framework

**Infrastructure:**

- `@nestjs/swagger` 8.1.1 - OpenAPI documentation
- `@scalar/nestjs-api-reference` 1.0.7 - API reference UI
- `nest-winston` 1.10.2 - Winston integration for NestJS
- `@nestjs-modules/mailer` 2.0.2 - Email module

## Configuration

**Environment:**

- Environment-based via `.env` files
- Priority order: `.env.local` > `.env.{ENV_NAME}` > `.env`
- `ENV_NAME` env var controls which env file is loaded
- Joi validation schemas for all configuration
- Config files located in `apps/api/src/config/`

**Build:**

- `turbo.json` - Turborepo task configuration
- `nest-cli.json` - NestJS CLI configuration
- `vite.config.ts` - Vite configuration (web and uni apps)
- `tsconfig.json` - TypeScript configuration per app

**Configuration Modules (Backend):**
| Config | File | Purpose |
|--------|------|---------|
| App | `apps/api/src/config/app/` | App name, port, salt, default users |
| ORM | `apps/api/src/config/orm/` | MySQL connection settings |
| Cache | `apps/api/src/config/cache/` | Redis cache configuration |
| JWT | `apps/api/src/config/jwt/` | JWT secret and expiry |
| Queue | `apps/api/src/config/queue/` | BullMQ Redis connection |
| Email | `apps/api/src/config/email/` | SMTP email settings |
| Winston | `apps/api/src/config/winston/` | Logging and MongoDB log storage |
| Swagger | `apps/api/src/config/swagger/` | API documentation |
| Throttler | `apps/api/src/config/throttler/` | Rate limiting |
| CORS | `apps/api/src/config/cors/` | CORS settings |
| Helmet | `apps/api/src/config/helmet/` | Security headers |
| HTTP | `apps/api/src/config/http/` | HTTP client settings |

## Platform Requirements

**Development:**

- Node.js >= 20.19.2
- pnpm >= 9.5.0
- Docker (for MySQL, Redis, MongoDB via `docker-compose.dev.yml`)

**Production:**

- Node.js runtime environment
- MySQL 8.4 database
- Redis 7.4 for caching and queues
- MongoDB 8.0 for log storage (optional, can use file logging)
- PM2 6.0.8 for process management

---

_Stack analysis: 2026-04-09_
