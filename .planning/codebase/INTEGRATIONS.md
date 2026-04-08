# External Integrations

**Analysis Date:** 2026-04-09

## APIs & External Services

**Email Service:**

- SMTP Email (QQ Mail or custom) - User registration, password reset, notifications
  - SDK/Client: `@nestjs-modules/mailer` with `nodemailer`
  - Config: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` env vars
  - Templates: Handlebars (`.hbs`) in `apps/api/src/templates/`
  - Implementation: `apps/api/src/common/infra/email/`

**HTTP Client:**

- Axios via `@nestjs/axios` - External HTTP requests
  - Config: `HTTP_TIMEOUT`, `HTTP_MAX_REDIRECTS` env vars
  - Module: `apps/api/src/common/infra/http/`

## Data Storage

**Databases:**

- **MySQL 8.4** - Primary relational database
  - Connection: `ORM_HOST`, `ORM_PORT`, `ORM_DATABASE`, `ORM_USERNAME`, `ORM_PASSWORD`
  - ORM: TypeORM with `mysql2` connector
  - Module: `apps/api/src/common/infra/orm/orm.module.ts`
  - Pool: Default 10 connections, configurable via `ORM_POOL_SIZE`

- **MongoDB 8.0** - Log storage (optional)
  - Connection: `WINSTON_MONGODB_*` env vars
  - ODM: Mongoose via `@nestjs/mongoose`
  - Module: `apps/api/src/common/infra/logging/logging.module.ts`
  - URI format: `mongodb://user:pass@host:port/db?authSource=authDb`

**File Storage:**

- Local filesystem only
  - Logs directory: configured via `WINSTON_FILE_DIRNAME`
  - Static files: served via `@nestjs/serve-static`

**Caching:**

- **Redis 7.4** - Multi-level caching with L1 (memory) + L2 (Redis)
  - Connection: `CACHE_REDIS_HOST`, `CACHE_REDIS_PORT`, `CACHE_REDIS_PASSWORD`
  - Client: `ioredis` via `@keyv/valkey`
  - Module: `apps/api/src/common/infra/cache/cache.module.ts`
  - L1: `KeyvCacheableMemory` (LRU cache)
  - L2: `KeyvValkey` (Redis)
  - Prefix: `CacheModule:` for all keys

**Queue:**

- **BullMQ** - Job queue for async processing
  - Connection: Same Redis as cache (configurable via `QUEUE_*` vars)
  - Module: `apps/api/src/common/infra/queue/queue.module.ts`
  - Queues: Email queue (`EMAIL_QUEUE_TOKEN`)

## Authentication & Identity

**Auth Provider:**

- Custom JWT-based authentication
  - Implementation: `apps/api/src/modules/auth/`
  - Strategies:
    - JWT (`apps/api/src/modules/auth/app/strategies/jwt.strategy.ts`)
    - Email login (`apps/api/src/modules/auth/app/strategies/email-login.strategy.ts`)
    - Phone login (`apps/api/src/modules/auth/app/strategies/phone-login.strategy.ts`)
    - SVG captcha login (`apps/api/src/modules/auth/app/strategies/svg-login.strategy.ts`)
  - Token storage: Redis cache for refresh tokens, blacklisting
  - Guards: `JwtGuard` (global), `ResourceGuard` (RBAC authorization)

**Password Encryption:**

- RSA encryption via `jsencrypt` for client-side password encryption
- Salt-based hashing server-side (configurable via `APP_SALT`)

**CSRF Protection:**

- `csrf-csrf` package for CSRF token management
- Cookie-based CSRF tokens

## Monitoring & Observability

**Error Tracking:**

- Custom exception filters in `apps/api/src/common/filters/`
  - `CacheExceptionFilter` - Cache errors
  - `HttpExceptionFilter` - HTTP errors
  - `OrmExceptionFilter` - Database errors
  - `UnknownExceptionFilter` - Unhandled errors

**Logs:**

- Winston with multiple transports
  - Console transport (development)
  - File transport (rotating files)
  - MongoDB transport (production with `WINSTON_MODE=mongodb`)
  - Log levels: error, warn, verbose, info (HTTP)
  - Module: `apps/api/src/common/infra/logging/`

**Health Checks:**

- `@nestjs/terminus` - Health endpoints
- System information via `systeminformation`

## CI/CD & Deployment

**Hosting:**

- PM2 for Node.js process management
  - Config: `ecosystem.config.js`
  - Scripts: `pm2:start`, `pm2:stop`, `pm2:restart`, `pm2:reload`

**CI Pipeline:**

- Not configured (no `.github` workflows detected)
- Git hooks via Husky for lint-staged

**Docker:**

- Development environment via `docker-compose.dev.yml`
  - MySQL 8.4 (port 3306)
  - Redis 7.4 (port 6379)
  - MongoDB 8.0 (port 27017)
  - Images from Tencent Cloud Container Registry

## Environment Configuration

**Required env vars:**

```
# App
APP_NAME, APP_PORT, APP_HOSTNAME, APP_GLOBAL_PREFIX, APP_SALT

# Database
ORM_HOST, ORM_PORT, ORM_DATABASE, ORM_USERNAME, ORM_PASSWORD

# Redis
REDIS_HOST, REDIS_PORT, REDIS_PASSWORD (or CACHE_REDIS_*)

# JWT
JWT_SECRET, JWT_EXPIRES_IN, JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN

# Email
EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS

# Winston (MongoDB logging)
WINSTON_MONGODB_HOST, WINSTON_MONGODB_PORT, WINSTON_MONGODB_USER_NAME, WINSTON_MONGODB_PASSWORD
```

**Secrets location:**

- `.env.local` (highest priority, git-ignored)
- `.env.{ENV_NAME}` (environment-specific)
- `.env` (defaults)

## Webhooks & Callbacks

**Incoming:**

- None detected

**Outgoing:**

- Email notifications via BullMQ queue

---

_Integration audit: 2026-04-09_
