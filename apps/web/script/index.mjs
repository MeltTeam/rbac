import { dirname, resolve } from 'node:path'
import { chdir } from 'node:process'
import { fileURLToPath } from 'node:url'
import { gCssVars } from './gCss.mjs'
import { generateDesignTokens } from './gDesignTokens.mjs'
import { colors } from './unoColors.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
chdir(resolve(__dirname, '..'))

console.warn('[开始] 生成设计系统文件...\n')

gCssVars(colors)
generateDesignTokens()

console.warn('\n[完成] 所有设计系统文件已生成!')
