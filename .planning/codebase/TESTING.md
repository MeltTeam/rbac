# Testing Patterns

**Analysis Date:** 2026-04-09

## Test Framework

**Runner:**

- Jest (configured in `apps/api/package.json`)
- Uses `@swc/jest` for fast TypeScript transformation
- No separate Jest config file; config embedded in `package.json`

**Assertion Library:**

- Jest built-in assertions (`expect`, `toBe`, `toThrow`, etc.)

**Run Commands:**

```bash
pnpm test              # Run all unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # Coverage report
pnpm test:debug        # Debug mode with Node inspector
pnpm test:e2e          # Run e2e tests (requires ./test/jest-e2e.json - not present)
```

## Test File Organization

**Location:**

- Co-located with source files (same directory)
- Test files use `.spec.ts` suffix

**Naming:**

- Pattern: `<filename>.spec.ts`
- Example: `jwt.guard.spec.ts` tests `jwt.guard.ts`

**Structure:**

```
apps/api/src/
├── common/
│   └── guards/
│       └── auth/
│           ├── jwt.guard.ts
│           └── jwt.guard.spec.ts
```

## Test Structure

**Suite Organization:**

```typescript
describe('jwtGuard', () => {
  let guard: JwtGuard
  let _reflector: Reflector
  let loggingService: LoggingService

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  }

  const mockLoggingService = {
    debug: jest.fn(),
  }

  const mockExecutionContext = (overrides: Partial<ExecutionContext> = {}): ExecutionContext => {
    // Factory function for creating mock objects
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtGuard, { provide: Reflector, useValue: mockReflector }, { provide: LoggingService, useValue: mockLoggingService }],
    }).compile()

    guard = module.get<JwtGuard>(JwtGuard)
    _reflector = module.get<Reflector>(Reflector)
    loggingService = module.get<LoggingService>(LoggingService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('canActivate', () => {
    it('公共接口应该直接放行', async () => {
      // Test implementation
    })

    it('非公共接口应该调用父类 canActivate', async () => {
      // Test implementation
    })
  })
})
```

**Patterns:**

- Setup: Use `beforeEach` with NestJS `Test.createTestingModule()`
- Teardown: Use `afterEach` with `jest.clearAllMocks()`
- Grouping: Nested `describe` blocks for method grouping
- Chinese test descriptions are used

## Mocking

**Framework:** Jest built-in mocking (`jest.fn()`, `jest.mock()`)

**Patterns:**

```typescript
// Mock entire module
jest.mock('@/common/deco', () => ({
  IS_PUBLIC_KEY: Symbol('IS_PUBLIC_KEY'),
  LogContextClass: () => (constructor: any) => constructor,
}))

// Mock service with implementation
jest.mock('@/common/infra/logging', () => ({
  LoggingService: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
  })),
}))

// Create mock objects
const mockReflector = {
  getAllAndOverride: jest.fn(),
}

// Spy on parent class methods
const superCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate').mockResolvedValue(true)

// Restore after test
superCanActivateSpy.mockRestore()
```

**What to Mock:**

- External dependencies (services, repositories)
- NestJS infrastructure (Reflector, ExecutionContext)
- Parent class methods when testing inheritance

**What NOT to Mock:**

- The class under test itself
- Simple data objects

## Fixtures and Factories

**Test Data:**

```typescript
// Factory function for creating mock execution context
const mockExecutionContext = (overrides: Partial<ExecutionContext> = {}): ExecutionContext => {
  const mockRequest: Partial<Request> = {
    headers: {},
    cookies: {},
  }
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: () => mockRequest,
      getResponse: () => ({}),
    }),
    getHandler: jest.fn().mockReturnValue({}),
    getClass: jest.fn().mockReturnValue({}),
    ...overrides,
  } as ExecutionContext
}
```

**Location:**

- Test fixtures defined inline within test files
- No separate fixture directory detected

## Coverage

**Requirements:** None enforced (no coverage thresholds configured)

**View Coverage:**

```bash
pnpm test:cov    # Generates coverage report in coverage/ directory
```

**Configuration:**

```json
{
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage"
}
```

## Test Types

**Unit Tests:**

- Primary test type used
- Focus on isolated class/method testing
- Use NestJS TestingModule for dependency injection
- Example: `jwt.guard.spec.ts`

**Integration Tests:**

- E2E test configuration referenced but `test/` directory does not exist
- Would require `jest-e2e.json` config file

**E2E Tests:**

- Not currently configured (test directory missing)
- Command `pnpm test:e2e` references `./test/jest-e2e.json` which does not exist

## Common Patterns

**Async Testing:**

```typescript
it('公共接口应该直接放行', async () => {
  const context = mockExecutionContext()
  mockReflector.getAllAndOverride.mockReturnValue(true)

  const result = await guard.canActivate(context)

  expect(result).toBe(true)
})
```

**Error Testing:**

```typescript
it('非公共接口且JWT验证失败应该拒绝访问', async () => {
  const context = mockExecutionContext()
  mockReflector.getAllAndOverride.mockReturnValue(false)

  const superCanActivateSpy = jest
    .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
    .mockRejectedValue(new Error('Unauthorized'))

  await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized')

  superCanActivateSpy.mockRestore()
})
```

**Testing with Mock Request:**

```typescript
const mockExecutionContext = (overrides: Partial<ExecutionContext> = {}): ExecutionContext => {
  const mockRequest: Partial<Request> = {
    headers: {},
    cookies: {},
  }
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: () => mockRequest,
      getResponse: () => ({}),
    }),
    getHandler: jest.fn().mockReturnValue({}),
    getClass: jest.fn().mockReturnValue({}),
    ...overrides,
  } as ExecutionContext
}
```

## Test Coverage Gaps

**Current State:**

- Only 1 test file found: `apps/api/src/common/guards/auth/jwt.guard.spec.ts`
- Frontend (`apps/web`) has no test files
- No `test/` directory for e2e tests in backend
- UniApp (`apps/uni`) has no test files

**Untested Areas:**

- All domain services
- All application services
- All command handlers
- All query handlers
- All controllers
- Frontend stores, components, utilities

---

_Testing analysis: 2026-04-09_
