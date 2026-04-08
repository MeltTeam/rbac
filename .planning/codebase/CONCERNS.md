# Codebase Concerns

**Analysis Date:** 2026-04-09

## Tech Debt

**Minimal Test Coverage:**

- Issue: Only 1 unit test file exists (`apps/api/src/common/guards/auth/jwt.guard.spec.ts`) for the entire backend codebase
- Files: `apps/api/src/` (entire backend)
- Impact: High risk of regressions, difficult refactoring, no safety net for changes
- Fix approach: Establish testing requirements for new code, add tests for critical paths (auth, RBAC logic, data operations)

**Deleted Test Files:**

- Issue: Git status shows `apps/api/src/common/guards/rbac/resource.guard.spec.ts` was deleted
- Files: `apps/api/src/common/guards/rbac/resource.guard.spec.ts`
- Impact: Lost test coverage for resource guard authorization
- Fix approach: Restore or rewrite the deleted test

**Type Safety Issues:**

- Issue: Multiple uses of `any` type bypass TypeScript's type checking
- Files: `apps/api/src/boot/boot.ts:14`, `apps/api/src/boot/boot.ts:22`, `apps/api/src/boot/boot.controller.ts:34`, `apps/api/src/modules/auth/infra/token/impl/jwt-token.service.ts:38`
- Impact: Runtime errors possible, reduced code reliability
- Fix approach: Define proper types for these interfaces

**Generated Code Quality:**

- Issue: `apps/api/src/metadata.ts` (3370 lines) is auto-generated with `/* eslint-disable */` header
- Files: `apps/api/src/metadata.ts`, `apps/api/src/generate-metadata.ts`
- Impact: Linting disabled for large file, may mask issues
- Fix approach: Acceptable for generated code, but ensure generation script is reliable

## Security Considerations

**Password Hashing Algorithm:**

- Risk: SHA256 is used for password hashing instead of bcrypt/argon2
- Files: `apps/api/src/modules/rbac/user/domain/services/impl/user-domain.service.ts:51-60`
- Current mitigation: Uses app salt + user salt combination
- Recommendations: Consider migrating to bcrypt or argon2 for better password hashing security

```typescript
// Current implementation (line 51-59)
async encryptPwd(pwd: string, userSalt: string) {
  const { salt: APP_SALT } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
  const HASH_SALT = wordArray(`${APP_SALT}:${userSalt}`)
  return sha256(pwd, HASH_SALT)
}
```

**Hardcoded Development Credentials:**

- Risk: Docker compose contains hardcoded passwords
- Files: `docker-compose.dev.yml` (MYSQL_ROOT_PASSWORD, REDIS_PASSWORD, MONGODB_ROOT_PASSWORD all set to "Aa123456")
- Current mitigation: Development-only, not for production
- Recommendations: Use Docker secrets or environment files, add warning comments

**JWT Token Retrieval:**

- Risk: Type casting with `as any` when extracting refresh token from request body
- Files: `apps/api/src/modules/auth/infra/token/impl/jwt-token.service.ts:38`
- Current mitigation: None
- Recommendations: Add proper DTO validation for token endpoint

```typescript
// Line 38 - uses `as any` for body access
const token = (req.cookies?.refresh as string) ?? ((req.body as any)?.refreshToken as string)
```

**CSRF Protection Disabled:**

- Risk: CSRF middleware is commented out
- Files: `apps/api/src/boot/init/initMiddlewares.ts:40-44`
- Current mitigation: None visible
- Recommendations: Enable CSRF protection for session-based authentication flows

**Console Logging in Production Code:**

- Risk: `console.error` and `console.warn` used in production code
- Files: `apps/api/src/main.ts:11`, `apps/api/src/boot/init/initRole.ts:121`, `apps/api/src/common/infra/logging/transports.ts:91`
- Current mitigation: Most logging uses Winston, these are edge cases
- Recommendations: Replace with proper LoggingService calls

## Performance Bottlenecks

**Initialization Race Condition:**

- Problem: `setTimeout` with 0ms delay for async initialization may cause timing issues
- Files: `apps/api/src/boot/boot.ts:49-54`, `apps/api/src/common/infra/cache/cache.template.ts:32`
- Cause: Relies on event loop timing rather than proper async coordination
- Improvement path: Use proper async initialization hooks or application lifecycle events

```typescript
// boot.ts lines 49-54
setTimeout(async () => {
  const limitR = await initResource(this.appInstance, configService)
  const limitM = await initMenu(this.appInstance, configService)
  await initRole(this.appInstance, configService, Math.max(limitR, limitM))
  await initUser(this.appInstance, configService)
}, 1)
```

**Distributed Lock Retry Strategy:**

- Problem: Default 10 retries with 100ms delay may not be optimal for high-load scenarios
- Files: `apps/api/src/common/infra/cache/cache.template.ts:39-68`
- Cause: Fixed retry parameters
- Improvement path: Make retry configurable per use case, add exponential backoff

## Fragile Areas

**Silent Error Handling:**

- Files: `apps/web/src/views/Login/SvgLogin/useSvgLogin.ts:80`, `apps/web/src/views/Login/SvgLogin/useSvgLogin.ts:139`, `apps/web/src/stores/modules/user.ts:106`
- Why fragile: `.catch(() => null)` swallows errors without logging or user feedback
- Safe modification: Add error logging before returning null
- Test coverage: None

**Empty Return Statements:**

- Files: Multiple command handlers return `[]` on validation failures
- Why fragile: May indicate incomplete operations without clear error signaling
- Safe modification: Ensure callers handle empty arrays appropriately
- Test coverage: None

```typescript
// Example from apps/api/src/modules/auth/app/commands/register.handler.ts:35
return [] // Silent failure when validation fails
```

**Tree Operations Complexity:**

- Files: `apps/api/src/common/template/tree-repository/tree-repository.template.ts` (248 lines)
- Why fragile: Complex closure table operations with multiple database queries
- Safe modification: Thoroughly test tree move/delete operations with edge cases
- Test coverage: None for tree repository

## Scaling Limits

**Cache L1 Store TTL:**

- Current capacity: Fixed TTL multiplier (0.8 \* Redis TTL)
- Limit: May not account for network latency variations
- Scaling path: Make TTL multiplier configurable, consider adaptive TTL

**MongoDB Connection Pool:**

- Current capacity: maxPoolSize: 200, minPoolSize: 2
- Files: `apps/api/src/common/infra/logging/transports.ts:116-127`
- Limit: Single connection instance shared across all log transports
- Scaling path: Monitor connection pool usage, adjust if logging throughput becomes bottleneck

## Dependencies at Risk

**Dual Redis Clients:**

- Risk: Using both `iovalkey` and `ioredis` packages - potential redundancy
- Impact: Increased bundle size, potential confusion
- Migration plan: Consolidate to single Redis client library

**class-validator/class-transformer:**

- Risk: Known issues with complex validation scenarios
- Impact: May encounter edge case validation failures
- Migration plan: Consider zod for schema validation (better TypeScript integration)

## Missing Critical Features

**Frontend Test Infrastructure:**

- Problem: No test files found in `apps/web/src/`
- Blocks: Reliable frontend refactoring, CI/CD quality gates

**API Rate Limiting Configuration:**

- Problem: Throttler guard exists but configuration may need tuning per endpoint
- Blocks: Fine-grained rate limiting for different API operations

## Test Coverage Gaps

**Backend Unit Tests:**

- What's not tested: Domain services, repositories, command handlers, query handlers
- Files: `apps/api/src/modules/*/` (all business modules)
- Risk: Business logic errors may go undetected
- Priority: High

**Backend E2E Tests:**

- What's not tested: Full request/response cycles
- Files: `apps/api/test/` (no e2e test files found)
- Risk: Integration issues between layers
- Priority: High

**Frontend Tests:**

- What's not tested: All Vue components, stores, utilities
- Files: `apps/web/src/` (entire frontend)
- Risk: UI regressions, state management bugs
- Priority: Medium

---

_Concerns audit: 2026-04-09_
