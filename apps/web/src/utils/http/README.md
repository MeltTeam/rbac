# HttpUtils - 插件化 HTTP 请求封装

## 目录

- [概述](#概述)
- [核心原理](#核心原理)
- [方案对比](#方案对比)
- [快速开始](#快速开始)
- [插件系统](#插件系统)
- [内置插件](#内置插件)
- [自定义插件](#自定义插件)
- [最佳实践](#最佳实践)
- [API 参考](#api-参考)

---

## 概述

HttpUtils 是一个基于 Axios 的插件化 HTTP 请求封装库，通过插件系统实现了请求处理逻辑的完全解耦和可扩展。

### 核心特性

| 特性           | 描述                                                     |
| -------------- | -------------------------------------------------------- |
| **插件化架构** | 所有功能通过插件实现，可按需组合、动态增删               |
| **优先级控制** | 插件可配置不同钩子的执行优先级，精确控制执行顺序         |
| **链式处理**   | 插件通过 `NEXT`/`END` 控制处理链的流转，灵活处理各种场景 |
| **类型安全**   | 完整的 TypeScript 类型支持，泛型推导请求/响应类型        |
| **上下文共享** | 插件通过 Context 共享能力和状态，支持插件间协作          |
| **请求标识**   | 内置多种请求 ID 生成规则，支持重复请求检测               |

### 设计理念

```
传统方案：功能耦合 → 难以维护 → 难以扩展 → 难以复用

HttpUtils 方案：
┌─────────────────────────────────────────────────────────┐
│                    HttpUtils 核心                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Plugin A │  │ Plugin B │  │ Plugin C │  │ Plugin D │    │
│  │ (限流)   │  │ (Token)  │  │ (错误)   │  │ (日志)   │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│        ↓            ↓            ↓            ↓         │
│                   优先级排序 → 链式执行                   │
└─────────────────────────────────────────────────────────┘
```

---

## 核心原理

### 1. 插件钩子生命周期

```
请求发起
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  onReq（请求拦截）                                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 1. 按优先级排序插件                               │    │
│  │ 2. 依次执行插件钩子                               │    │
│  │ 3. 检查返回值：                                   │    │
│  │    - NEXT: 更新数据，继续下一个插件               │    │
│  │    - END: 更新数据，终止链                        │    │
│  │ 4. 异常处理：                                     │    │
│  │    - LIMIT/OFFLINE: 直接抛出                     │    │
│  │    - 其他异常: 跳过当前插件，继续执行             │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
    │
    ▼
发送 HTTP 请求
    │
    ├──────────────┬──────────────┐
    │              │              │
    ▼              ▼              ▼
  成功          请求错误       响应错误
    │              │              │
    ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌───────────┐
│ onRes   │  │ onReqErr │  │ onResErr  │
│ 成功响应 │  │ 请求阶段  │  │ 响应阶段  │
│ 拦截处理 │  │ 错误处理  │  │ 错误处理  │
└─────────┘  └──────────┘  └───────────┘
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
              返回给调用方
```

### 2. 插件返回值控制

每个插件钩子必须返回 `IPluginRes` 对象：

```typescript
interface IPluginRes<T> {
  type: PluginResType // 'NEXT' | 'END'
  res: T // 处理后的数据
}
```

| 返回值 | 含义     | 行为                       | 使用场景                     |
| ------ | -------- | -------------------------- | ---------------------------- |
| `NEXT` | 继续传递 | 更新数据，执行下一个插件   | 插件不处理或处理后需传递     |
| `END`  | 终止链   | 更新数据，不再执行后续插件 | 插件已完全处理，无需后续介入 |

### 3. 优先级机制

优先级数字越小，越先执行：

```typescript
// 方式一：统一优先级
priority: 5

// 方式二：分钩子配置
priority: {
  onReq: 0,      // 请求拦截优先级
  onReqErr: 5,   // 请求错误优先级
  onRes: 10,     // 响应拦截优先级
  onResErr: 5,   // 响应错误优先级
  default: 0,    // 默认优先级（未配置的钩子使用）
}
```

### 4. 插件上下文 (Context)

每个插件钩子都会接收 `ctx` 参数，提供以下能力：

```typescript
interface IHttpUtilsPluginCTX<C = any> {
  // 创建插件返回值
  createPluginRes: <T>(type: PluginResType, res: T) => Promise<IPluginRes<T>>

  // 插件管理
  getPlugins: () => IHttpUtilsPlugin<C>[] | null
  setPlugin: (plugin: IHttpUtilsPlugin<C>) => Promise<boolean>
  delPlugin: (plugin: IHttpUtilsPlugin<C>) => boolean
  getPlugin: (pluginName: string) => IHttpUtilsPlugin<C> | null
  clearPlugins: () => void

  // 配置访问
  defaultConfig: IHttpUtilsOptions<C>
  generateRequestId: (config: ICustomAxiosRequestConfig<C>) => string

  // 请求方法（用于重试等场景）
  request: <VO, DTO>(url: string, config: ICustomAxiosRequestConfig<C, DTO>) => Promise<VO>
  get: <VO, DTO>(url: string, params?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<VO>
  post: <VO, DTO>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<VO>
  delete: <VO, DTO>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<VO>
  put: <VO, DTO>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<VO>
  patch: <VO, DTO>(url: string, data?: DTO, config?: ICustomAxiosRequestConfig<C, DTO>) => Promise<VO>
}
```

### 5. 请求 ID 生成规则

```typescript
const REQUEST_ID_RULES = {
  UUID: 'UUID', // 使用 UUID
  METHOD_URL_PARAMS_DATA: 'METHOD_URL_PARAMS_DATA', // method + url + params + data
  METHOD_URL_PARAMS: 'METHOD_URL_PARAMS', // method + url + params
  METHOD_URL_DATA: 'METHOD_URL_DATA', // method + url + data
  METHOD_URL: 'METHOD_URL', // method + url
}
```

---

## 方案对比

### 1. 与传统 Axios 封装对比

#### 传统封装示例

```typescript
// 传统方式：所有逻辑集中在一个拦截器中
const instance = axios.create()

instance.interceptors.request.use(
  (config) => {
    // Token 处理
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    // 重复请求处理
    if (pendingRequests.has(config.url)) {
      pendingRequests.get(config.url).cancel()
    }
    pendingRequests.set(config.url, createCancelToken())

    // 限流处理
    if (isRateLimited(config)) {
      return Promise.reject(new Error('请求过于频繁'))
    }

    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 处理
    if (error.response?.status === 401) {
      // 刷新 token 逻辑...
    }

    // 500 处理
    if (error.response?.status >= 500) {
      ElMessage.error('服务器错误')
    }

    // 网络错误处理
    if (!error.response) {
      ElMessage.error('网络错误')
    }

    return Promise.reject(error)
  },
)
```

#### HttpUtils 插件化方案

```typescript
// 插件化方式：功能拆分为独立插件
const http = new HttpUtils<CustomConfig>()

http.plugins = [
  LimitPlugin, // 限流
  NetworkStatusPlugin, // 网络状态检测
  DuplicationPlugin, // 重复请求处理
  NetworkErrorPlugin, // 网络错误处理
  TokenPlugin, // Token 管理
]
```

#### 对比总结

| 维度         | 传统封装           | HttpUtils 插件化   |
| ------------ | ------------------ | ------------------ |
| **代码组织** | 集中式，单文件     | 分散式，独立插件   |
| **可维护性** | 低，改一处影响全局 | 高，插件独立维护   |
| **可扩展性** | 差，需修改核心代码 | 好，新增插件即可   |
| **可复用性** | 差，难以跨项目复用 | 好，插件可独立复用 |
| **可测试性** | 差，难以隔离测试   | 好，插件独立测试   |
| **执行顺序** | 固定，难以调整     | 灵活，优先级控制   |
| **功能开关** | 需条件判断         | 插件动态增删       |
| **类型安全** | 一般               | 完整类型推导       |

---

### 2. 与 axios-retry 对比

[axios-retry](https://github.com/softonic/axios-retry) 是一个专门处理重试的 Axios 插件。

#### axios-retry 方式

```typescript
import axiosRetry from 'axios-retry'

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error.response?.status === 503,
})
```

#### HttpUtils 方式

```typescript
const RetryPlugin: IHttpUtilsPlugin = {
  name: 'RETRY_PLUGIN',
  priority: { onResErr: 0 },
  onResErr: async (err, ctx) => {
    const config = err.config
    const retryCount = config.retryCount ?? 0
    const maxRetries = 3

    if (retryCount < maxRetries && shouldRetry(err)) {
      config.retryCount = retryCount + 1
      await delay(1000 * Math.pow(2, retryCount))
      const result = await ctx.request(config.url!, config)
      return ctx.createPluginRes(PluginResType.END, result)
    }
    return ctx.createPluginRes(PluginResType.NEXT, err)
  },
}
```

#### 对比

| 维度               | axios-retry  | HttpUtils         |
| ------------------ | ------------ | ----------------- |
| **功能范围**       | 仅重试       | 全功能插件系统    |
| **配置方式**       | 全局配置     | 插件 + 请求级配置 |
| **扩展性**         | 仅限重试逻辑 | 可扩展任意功能    |
| **与其他功能协作** | 需额外集成   | 天然协作          |
| **适用场景**       | 简单重试需求 | 复杂请求处理场景  |

---

### 3. 与 ky/ofetch 对比

[ky](https://github.com/sindresorhus/ky) 和 [ofetch](https://github.com/unjs/ofetch) 是现代化的 fetch 封装库。

#### ky 方式

```typescript
import ky from 'ky'

const api = ky.create({
  prefixUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // 刷新 token...
        }
      },
    ],
  },
})
```

#### HttpUtils 方式

```typescript
const http = new HttpUtils({ baseURL: 'https://api.example.com' })
http.plugins = [TokenPlugin, NetworkErrorPlugin]
```

#### 对比

| 维度           | ky/ofetch       | HttpUtils                     |
| -------------- | --------------- | ----------------------------- |
| **底层实现**   | Fetch API       | Axios                         |
| **拦截器模式** | 钩子函数数组    | 优先级插件链                  |
| **执行控制**   | 无终止机制      | NEXT/END 控制                 |
| **错误处理**   | 需手动处理      | 插件统一处理                  |
| **浏览器兼容** | 需 polyfill     | Axios 内置兼容                |
| **请求取消**   | AbortController | CancelToken + AbortController |
| **类型推导**   | 一般            | 完整泛型支持                  |

---

### 4. 与 Alova 对比

[Alova](https://alova.js.org/) 是一个请求策略库，强调请求策略和状态管理。

#### Alova 方式

```typescript
import { createAlova } from 'alova'
import { useRequest } from 'alova/client'

const alovaInstance = createAlova({
  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    method.config.headers.Authorization = `Bearer ${token}`
  },
  responded: {
    onSuccess: async (response) => response.data,
    onError: (error) => console.error(error),
  },
})

// 使用 hooks
const { data, loading, error } = useRequest(alovaInstance.Get('/api/users'))
```

#### HttpUtils 方式

```typescript
// 直接使用
const users = await http.get<UserVO[]>('/users')

// 或配合 VueUse
import { useFetch } from '@vueuse/core'
const { data, isFetching, error } = useFetch('/api/users', { http }).json()
```

#### 对比

| 维度         | Alova               | HttpUtils        |
| ------------ | ------------------- | ---------------- |
| **设计理念** | 请求策略 + 状态管理 | 纯请求封装       |
| **框架绑定** | 强绑定框架 Hooks    | 框架无关         |
| **学习成本** | 较高（新概念）      | 低（基于 Axios） |
| **迁移成本** | 高（需重写）        | 低（渐进式迁移） |
| **状态管理** | 内置                | 需配合其他库     |
| **插件扩展** | 有限                | 灵活可控         |

---

### 5. 综合对比表

| 方案            | 核心优势           | 核心劣势               | 适用场景               |
| --------------- | ------------------ | ---------------------- | ---------------------- |
| **传统封装**    | 简单直接，无依赖   | 耦合严重，难扩展       | 小型项目               |
| **axios-retry** | 专注重试，开箱即用 | 功能单一               | 仅需重试功能           |
| **ky/ofetch**   | 现代 API，轻量     | Fetch 兼容性，功能有限 | 新项目，简单场景       |
| **Alova**       | 策略丰富，状态集成 | 学习成本高，框架绑定   | 复杂前端应用           |
| **HttpUtils**   | 插件化，灵活可控   | 需理解插件机制         | 中大型项目，需要扩展性 |

---

## 快速开始

### 基础使用

```typescript
import { HttpUtils } from './HttpUtils'

// 创建实例
const http = new HttpUtils({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// GET 请求
const users = await http.get<UserVO[]>('/users')

// POST 请求
const result = await http.post<ResultVO>('/users', { name: 'John' })

// 带配置的请求
const data = await http.post<ResultVO, UserDTO>('/users', userData, {
  headers: { 'X-Custom': 'value' },
  customConfig: {
    TokenPlugin: { showError: false },
  },
})
```

### 参数序列化（qs）

HttpUtils 默认使用 [qs](https://github.com/ljharb/qs) 进行查询参数序列化，解决了 Axios 默认序列化无法处理对象数组的问题：

```typescript
// 默认配置
paramsSerializer: {
  serialize: (params) => qs.stringify(params, {
    arrayFormat: 'brackets',  // 数组使用 brackets 格式：a[]=1&a[]=2
    skipNulls: true,          // 跳过 null 值
  }),
}
```

**为什么使用 qs？**

| 场景     | Axios 默认 | qs (brackets)                 |
| -------- | ---------- | ----------------------------- |
| 简单数组 | `a=1,2`    | `a[]=1&a[]=2`                 |
| 对象数组 | ❌ 不支持  | `a[0][id]=1&a[0][name]=foo`   |
| 嵌套对象 | ❌ 不支持  | `user[name]=foo&user[age]=18` |
| null 值  | `a=null`   | 跳过（skipNulls）             |

**示例：**

```typescript
// 发送对象数组参数
await http.get('/api/users', {
  filter: [
    { field: 'name', value: 'John' },
    { field: 'age', value: 18 },
  ],
})

// 实际请求 URL：
// /api/users?filter[0][field]=name&filter[0][value]=John&filter[1][field]=age&filter[1][value]=18
```

**自定义序列化：**

```typescript
const http = new HttpUtils({
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(params, {
        arrayFormat: 'indices', // 使用索引格式：a[0]=1&a[1]=2
        skipNulls: true,
      }),
  },
})
```

### 添加插件

```typescript
import { TokenPlugin, NetworkErrorPlugin } from './plugins'

// 方式一：直接设置
http.plugins = [TokenPlugin, NetworkErrorPlugin]

// 方式二：动态添加
await http.setPlugin(TokenPlugin)

// 删除插件
http.delPlugin(TokenPlugin)

// 清空所有插件
http.clearPlugins()
```

### 完整示例

```typescript
import { HttpUtils } from './HttpUtils'
import { TokenPlugin, NetworkErrorPlugin, LimitPlugin, DuplicationPlugin, NetworkStatusPlugin } from './plugins'

// 定义自定义配置类型
interface CustomConfig {
  TokenPlugin?: { showError?: boolean }
  LimitPlugin?: { enabled?: boolean; limitTime?: number }
  DuplicationPlugin?: { allowDuplication?: boolean }
}

// 创建实例
export const http = new HttpUtils<CustomConfig>({
  baseURL: '/api',
  timeout: 10000,
  customConfig: {
    NetworkStatusPlugin: { enabled: true },
  },
})

// 注册插件（按 onReq 优先级升序）
http.plugins = [
  LimitPlugin, // 0: 最先拦截频繁请求
  NetworkStatusPlugin, // 1: 检测网络状态
  DuplicationPlugin, // 2: 处理重复请求
  TokenPlugin, // 3: 添加 Token
  NetworkErrorPlugin, // 4: 错误处理
]

// 使用
async function fetchUsers() {
  const users = await http.get<UserVO[]>(
    '/users',
    { page: 1 },
    {
      customConfig: {
        LimitPlugin: { enabled: false }, // 此请求不限流
      },
    },
  )
  return users
}
```

---

## 插件系统

### 插件接口定义

```typescript
interface IHttpUtilsPlugin<C = any> {
  /** 插件名（唯一标识） */
  name: string

  /** 优先级配置 */
  priority?: IHttpUtilsPluginPriority | number

  /** 插件私有配置 */
  config?: C

  /** 请求拦截钩子 */
  onReq?: (config: ICustomInternalAxiosRequestConfig<C>, ctx: IHttpUtilsPluginCTX<C>) => Promise<IPluginRes<ICustomInternalAxiosRequestConfig<C>>>

  /** 请求错误钩子 */
  onReqErr?: (err: ICustomAxiosError<C>, ctx: IHttpUtilsPluginCTX<C>) => Promise<IPluginRes<ICustomAxiosError<C>>>

  /** 响应拦截钩子 */
  onRes?: (res: ICustomAxiosResponse<C>, ctx: IHttpUtilsPluginCTX<C>) => Promise<IPluginRes<ICustomAxiosResponse<C>>>

  /** 响应错误钩子 */
  onResErr?: (err: ICustomAxiosError<C>, ctx: IHttpUtilsPluginCTX<C>) => Promise<IPluginRes<ICustomAxiosError<C>>>
}
```

### runHook 执行流程

```typescript
async runHook<H extends THttpUtilsPluginHook>(hook: H, data: TPluginHookData<C, H>) {
  // 1. 按优先级排序插件
  const sortedPlugins = this.sortPlugins(this.plugins, hook)

  let currentData = data

  for (const plugin of sortedPlugins) {
    const pluginHook = plugin[hook]

    if (pluginHook) {
      try {
        // 2. 执行插件钩子
        const res = await pluginHook(currentData, this.ctx)

        // 3. 检查返回值
        if (this.isPluginRes(res)) {
          currentData = res.res

          // 4. 如果是 END，终止链
          if (res.type === PluginResType.END) {
            return currentData
          }
        }
      } catch (err) {
        // 5. 异常处理
        // LIMIT/OFFLINE 错误直接抛出（不吞掉）
        if (axios.isAxiosError(err) && err.code && ['LIMIT', 'OFFLINE'].includes(err.code)) {
          throw err
        }
        // 其他异常跳过当前插件，继续执行（保持系统稳定性）
        continue
      }
    }
  }

  return currentData
}
```

---

## 内置插件

### 插件优先级总览

#### onReq（请求拦截）

| 优先级 | 插件                | 职责               | 说明                           |
| ------ | ------------------- | ------------------ | ------------------------------ |
| 0      | LimitPlugin         | 限流检测           | 最先拦截频繁请求，减少后续处理 |
| 1      | NetworkStatusPlugin | 网络状态检测       | 限流后再检测，减少测试请求次数 |
| 2      | DuplicationPlugin   | 重复请求检测       | 取消重复请求                   |
| 3      | TokenPlugin         | 添加 Authorization | 最后添加认证头                 |

#### onResErr（响应错误）

| 优先级 | 插件                | 职责                | 说明                 |
| ------ | ------------------- | ------------------- | -------------------- |
| 5      | NetworkStatusPlugin | 处理 OFFLINE        | 特殊错误码，优先处理 |
| 5      | LimitPlugin         | 处理 LIMIT          | 特殊错误码，优先处理 |
| 6      | TokenPlugin         | 处理 401            | 认证错误，刷新 Token |
| 7      | NetworkErrorPlugin  | 处理 5xx/403/404 等 | 服务端错误           |
| 10     | DuplicationPlugin   | 处理取消请求        | 最后清理队列         |

### 1. LimitPlugin（限流插件）

```typescript
interface ILimitPluginConfig {
  enabled?: boolean // 是否启用
  showError?: boolean // 是否显示错误提示
  message?: string // 错误提示消息
  duration?: number // 提示显示时长
  limitTime?: number // 限流时间（毫秒）
  limitType?: 'throttle' | 'debounce' // 限流类型
  persist?: boolean // 是否持久化到 localStorage
  storageKeyPrefix?: string // 存储 key 前缀
}
```

**功能**：

- 支持 `throttle`（节流）和 `debounce`（防抖）两种模式
- 支持持久化到 localStorage，跨页面共享限流状态
- 自动清理过期的限流记录

### 2. NetworkStatusPlugin（网络状态检测插件）

```typescript
interface INetworkStatusPluginConfig {
  enabled?: boolean // 是否启用
  showError?: boolean // 是否显示错误提示
  message?: string // 离线提示消息
  duration?: number // 提示显示时长
  checkUrls?: string[] // 检测端点列表
  checkTimeout?: number // 检测超时时间
  cacheTime?: number // 缓存有效期
}
```

**功能**：

- 请求前检测网络状态
- 使用 Image 对象进行网络探测，不依赖 CORS
- 缓存检测结果，减少探测请求
- 发送离线/在线事件通知

### 3. DuplicationPlugin（重复请求处理插件）

```typescript
interface IDuplicationPluginConfig {
  showError?: boolean // 是否显示取消提示
  message?: string // 取消提示消息
  duration?: number // 提示显示时长
  allowDuplication?: boolean // 是否允许重复请求
}
```

**功能**：

- 检测重复请求并取消旧请求
- 支持请求级跳过检测
- 自动清理请求队列

### 4. TokenPlugin（Token 管理插件）

```typescript
interface ITokenPluginConfig {
  showError?: boolean // 是否显示错误提示
  msg?: string // Token 失效提示
  duration?: number // 提示显示时长
  refreshUrl?: string // 刷新 Token 接口
  logoutUrl?: string // 登出接口
}
```

**功能**：

- 自动添加 Authorization 头
- 401 时自动刷新 Token
- 刷新失败自动登出
- 并发请求队列管理（等待刷新完成）
- 支持重置状态（用于重新登录）

### 5. NetworkErrorPlugin（网络错误处理插件）

```typescript
interface INetworkErrorPluginConfig {
  showError?: boolean // 是否显示错误提示
  msg?: string // 错误提示前缀
  duration?: number // 提示显示时长
  skipFn?: (err: ICustomAxiosError) => boolean // 跳过判断函数
}
```

**功能**：

- 处理 500+、403、404、429、400 等状态码
- 支持自定义跳过逻辑
- 统一错误提示

---

## 自定义插件

### 基础模板

```typescript
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX } from '../IPlugin'
import type { ICustomAxiosError, ICustomInternalAxiosRequestConfig } from '../IHttpUtils'
import { PluginResType } from '../IHttpUtils'

export interface IMyPluginConfig {
  enabled?: boolean
}

export const MY_PLUGIN = 'MY_PLUGIN'

export const MyPlugin: IHttpUtilsPlugin<IMyPluginConfig> = {
  name: MY_PLUGIN,

  priority: {
    onReq: 5,
    onResErr: 5,
    default: 0,
  },

  config: {
    enabled: true,
  },

  onReq: async (config, ctx) => {
    const pluginConfig = {
      ...ctx.getPlugin(MY_PLUGIN)!.config,
      ...config.customConfig?.MyPlugin,
    }

    if (!pluginConfig.enabled) {
      return ctx.createPluginRes(PluginResType.NEXT, config)
    }

    // 处理逻辑...

    return ctx.createPluginRes(PluginResType.NEXT, config)
  },

  onResErr: async (err, ctx) => {
    // 不处理，传递给下一个插件
    return ctx.createPluginRes(PluginResType.NEXT, err)
  },
}
```

### 实战示例：重试插件

```typescript
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX } from '../IPlugin'
import type { ICustomAxiosError } from '../IHttpUtils'
import { PluginResType } from '../IHttpUtils'

export interface IRetryPluginConfig {
  maxRetries?: number
  retryDelay?: number
  retryCondition?: (err: ICustomAxiosError) => boolean
}

export const RETRY_PLUGIN = 'RETRY_PLUGIN'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const RetryPlugin: IHttpUtilsPlugin<IRetryPluginConfig> = {
  name: RETRY_PLUGIN,
  priority: { onResErr: 0 }, // 最先执行

  config: {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (err) => !err.response || err.response.status >= 500,
  },

  onResErr: async (err, ctx) => {
    const pluginConfig = {
      ...ctx.getPlugin(RETRY_PLUGIN)!.config,
      ...err.config?.customConfig?.RetryPlugin,
    }

    const retryCount = (err.config as any)?._retryCount ?? 0

    if (retryCount < pluginConfig.maxRetries! && pluginConfig.retryCondition!(err)) {
      const config = err.config as any
      config._retryCount = retryCount + 1

      await delay(pluginConfig.retryDelay! * Math.pow(2, retryCount))

      try {
        const result = await ctx.request(config.url!, config)
        return ctx.createPluginRes(PluginResType.END, result)
      } catch (retryErr) {
        // 重试失败，继续传递给其他插件
        return ctx.createPluginRes(PluginResType.NEXT, retryErr as ICustomAxiosError)
      }
    }

    return ctx.createPluginRes(PluginResType.NEXT, err)
  },
}
```

### 实战示例：日志插件

```typescript
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX } from '../IPlugin'
import type { ICustomAxiosError, ICustomAxiosResponse, ICustomInternalAxiosRequestConfig } from '../IHttpUtils'
import { PluginResType } from '../IHttpUtils'

export interface ILogPluginConfig {
  enabled?: boolean
  logRequest?: boolean
  logResponse?: boolean
  logError?: boolean
  logger?: (...args: any[]) => void
}

export const LOG_PLUGIN = 'LOG_PLUGIN'

export const LogPlugin: IHttpUtilsPlugin<ILogPluginConfig> = {
  name: LOG_PLUGIN,
  priority: 100, // 最后执行

  config: {
    enabled: true,
    logRequest: true,
    logResponse: true,
    logError: true,
    logger: console.log,
  },

  onReq: async (config, ctx) => {
    const pluginConfig = {
      ...ctx.getPlugin(LOG_PLUGIN)!.config,
      ...config.customConfig?.LogPlugin,
    }

    if (pluginConfig.enabled && pluginConfig.logRequest) {
      pluginConfig.logger!(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }

    return ctx.createPluginRes(PluginResType.NEXT, config)
  },

  onRes: async (res, ctx) => {
    const pluginConfig = {
      ...ctx.getPlugin(LOG_PLUGIN)!.config,
      ...res.config.customConfig?.LogPlugin,
    }

    if (pluginConfig.enabled && pluginConfig.logResponse) {
      pluginConfig.logger!(`[HTTP Response] ${res.config.url}`, res.data)
    }

    return ctx.createPluginRes(PluginResType.NEXT, res)
  },

  onResErr: async (err, ctx) => {
    const pluginConfig = {
      ...ctx.getPlugin(LOG_PLUGIN)!.config,
      ...err.config?.customConfig?.LogPlugin,
    }

    if (pluginConfig.enabled && pluginConfig.logError) {
      console.error(`[HTTP Error] ${err.config?.url}`, {
        status: err.response?.status,
        message: err.message,
      })
    }

    return ctx.createPluginRes(PluginResType.NEXT, err)
  },
}
```

---

## 最佳实践

### 1. 插件顺序

```typescript
// 推荐顺序（按 onReq 优先级升序）
http.plugins = [
  LimitPlugin, // 0: 最先拦截频繁请求
  NetworkStatusPlugin, // 1: 检测网络状态
  DuplicationPlugin, // 2: 处理重复请求
  TokenPlugin, // 3: 最后添加 Token
  NetworkErrorPlugin, // 4: 错误处理
]
```

### 2. 请求级配置覆盖

```typescript
// 单个请求禁用某个插件
await http.get('/api/data', params, {
  customConfig: {
    LimitPlugin: { enabled: false },
    DuplicationPlugin: { allowDuplication: true },
  },
})
```

### 3. 动态插件管理

```typescript
// 根据环境动态加载插件
if (import.meta.env.PROD) {
  await http.setPlugin(LogPlugin)
}

// 根据用户权限动态添加
if (user.hasFeature('advanced-cache')) {
  await http.setPlugin(CachePlugin)
}
```

### 4. 错误事件统一处理

```typescript
import { eventBus } from '@/eventBus'

// 统一注册错误提示处理
eventBus.on('HTTP_PLUGIN:TOKEN_PLUGIN:ShowError', (msg, duration) => {
  ElMessage.error({ message: msg, duration })
})

eventBus.on('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError', (msg, duration) => {
  ElMessage.error({ message: msg, duration })
})
```

### 5. 类型安全配置

```typescript
// 定义项目级自定义配置类型
interface CustomConfig {
  TokenPlugin?: ITokenPluginConfig
  LimitPlugin?: ILimitPluginConfig
  RetryPlugin?: IRetryPluginConfig
}

// 创建类型安全的实例
export const http = new HttpUtils<CustomConfig>({
  baseURL: '/api',
})

// 使用时会有完整的类型提示
await http.get('/users', undefined, {
  customConfig: {
    TokenPlugin: { showError: false }, // ✅ 类型安全
  },
})
```

---

## API 参考

### HttpUtils 类

#### 构造函数

```typescript
constructor(options?: IHttpUtilsOptions<C>)
```

#### 属性

| 属性            | 类型                     | 描述       |
| --------------- | ------------------------ | ---------- |
| `axiosInstance` | `AxiosInstance`          | Axios 实例 |
| `defaultConfig` | `IHttpUtilsOptions<C>`   | 默认配置   |
| `plugins`       | `IHttpUtilsPlugin<C>[]`  | 插件列表   |
| `ctx`           | `IHttpUtilsPluginCTX<C>` | 插件上下文 |

#### 方法

| 方法                            | 描述           |
| ------------------------------- | -------------- |
| `createPluginRes<T>(type, res)` | 创建插件返回值 |
| `setPlugin(plugin)`             | 添加插件       |
| `getPlugins()`                  | 获取插件列表   |
| `delPlugin(plugin)`             | 删除插件       |
| `getPlugin(name)`               | 获取插件       |
| `clearPlugins()`                | 清空插件       |
| `runHook(hook, data)`           | 执行钩子       |
| `generateRequestId(config)`     | 生成请求 ID    |
| `request(url, config)`          | 基础请求       |
| `get(url, params?, config?)`    | GET 请求       |
| `post(url, data?, config?)`     | POST 请求      |
| `delete(url, data?, config?)`   | DELETE 请求    |
| `put(url, data?, config?)`      | PUT 请求       |
| `patch(url, data?, config?)`    | PATCH 请求     |

### 类型定义

```typescript
// 插件结果类型
enum PluginResType {
  NEXT = 'NEXT',
  END = 'END',
}

// 插件结果
interface IPluginRes<T> {
  type: PluginResType
  res: T
}

// 扩展配置
interface IExtendConfig<C = any> {
  requestIdRules?: TRequestIdRules
  requestId?: string
  customConfig?: C
}

// 请求 ID 生成规则
type TRequestIdRules = 'UUID' | 'METHOD_URL_PARAMS_DATA' | 'METHOD_URL_PARAMS' | 'METHOD_URL_DATA' | 'METHOD_URL'
```

---

## 总结

HttpUtils 通过插件化架构解决了传统 Axios 封装的问题：

1. **解耦**：每个功能独立成插件，职责单一
2. **灵活**：通过优先级控制执行顺序
3. **可扩展**：新增功能只需添加新插件
4. **可维护**：插件独立开发、测试、复用
5. **类型安全**：完整的 TypeScript 支持
6. **可控性**：NEXT/END 机制精确控制处理流程

这种设计模式不仅适用于 HTTP 请求封装，也可以借鉴到其他需要链式处理的场景中。
