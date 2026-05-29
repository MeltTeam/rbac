import { defineConfig } from 'openapi-ts-request'

console.clear()

export default defineConfig([
  {
    describe: '@apps/api',
    schemaPath: 'http://127.0.0.1:4001/swagger.json',
    serversPath: './src/apis',
    requestLibPath: `import { http } from '@/utils/http';\n import type { ICustomAxiosRequestConfig } from '@/utils/http/IHttpUtils';`,
    requestOptionsType: 'ICustomAxiosRequestConfig',
    isGenReactQuery: false,
    reactQueryMode: 'vue',
    isGenJavaScript: false,
    templatesFolder: './templates',
    isCamelCase: true,
    isSplitTypesByModule: true,
    // enableLogging: true,
    hook: {
      customClassName: (tagName: string) => `modules/${tagName}/${tagName}`,
      afterOpenApiDataInited: (openAPIData) => {
        // 可以统一更改url前缀
        // openAPIData.paths = Object.fromEntries(Object.entries(openAPIData.paths).map(([path, methods]) => [path.replace('/v1', ''), methods]))
        // console.warn(openAPIData.paths)
        return openAPIData
      },
      customFunctionName(data) {
        // 解析description中定义的函数名
        if (data.description && (data.description as string).length !== 0) {
          return data.description
        }
        const urlToCamelCase = (url: string) => {
          return url
            .replace(/^\//, '')
            .split('/')
            .map((part, index) => {
              const sanitized = part.replace(/[^a-z0-9]/gi, '')
              return index === 0 ? sanitized : sanitized.charAt(0).toUpperCase() + sanitized.slice(1)
            })
            .join('')
        }
        const method = data.method?.charAt(0).toUpperCase() + data.method?.slice(1).toLowerCase() || ''
        return urlToCamelCase(data.path || '') + method
      },
    },
  },
])
