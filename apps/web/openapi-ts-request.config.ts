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
        console.warn(openAPIData)
        return openAPIData
      },
      customFunctionName(data) {
        // 解析summary中[]定义的函数名
        const bracketMatch = data.summary?.match(/\[([^\]]+)\]$/)
        if (bracketMatch) {
          return bracketMatch[1]
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
