import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
// import axios from 'axios'
import crypto from 'crypto-js'

// 读取 localeKeys
const indexTs = readFileSync('./src/i18n/index.ts', 'utf-8')
const localeKeysMatch = indexTs.match(/localeKeys\s*=\s*\[([^\]]+)\]/)
if (!localeKeysMatch) throw new Error('未找到 localeKeys 配置')
const localeKeys = localeKeysMatch[1]
  .split(',')
  .map((s) => s.replace(/['"\s]/g, ''))
  .filter(Boolean)

// 配置
const config = {
  targetDir: './src',
  outputDir: './src/i18n/locales',
  fileExtensions: ['.ts', '.tsx', '.vue'],
  zhKey: localeKeys[0],
}

// 正则
// eslint-disable-next-line regexp/prefer-w, regexp/no-useless-lazy
const tRegex = /[^a-zA-Z0-9_.$]t\s*\(\s*(['"`])([^'"`]+?)\1\s*\)/g

async function translate(text, _to) {
  // https://api.fanyi.baidu.com/product/113
  // const { data } = await axios.get(`https://fanyi-api.baidu.com/api/trans/vip/translate`, {
  //   params: {
  //     sl: 'auto',
  //     tl: to,
  //     q: text,
  //     sign: '',
  //   },
  // })
  // console.warn(data)
  return text
}

// 递归扫描
function traverseDirectory(dir, callback) {
  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      traverseDirectory(fullPath, callback)
    } else if (config.fileExtensions.includes(path.extname(file))) {
      callback(fullPath)
    }
  }
}

// 生成hash
function hash(str) {
  return crypto.MD5(str).toString().substring(0, 8)
}

// 主流程
async function main() {
  const zhMap = {}
  traverseDirectory(config.targetDir, (filePath) => {
    const content = readFileSync(filePath, 'utf-8')
    let match
    // eslint-disable-next-line no-cond-assign
    while ((match = tRegex.exec(` ${content}`)) !== null) {
      const rawText = match[2]
      if (rawText) {
        const key = hash(rawText)
        zhMap[key] = rawText
      }
    }
  })

  // 生成各语言json
  for (const locale of localeKeys) {
    const outPath = path.join(config.outputDir, `${locale}.json`)
    const outputDir = path.dirname(outPath)
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

    let data = {}
    if (locale === config.zhKey) {
      data = zhMap
    } else {
      // 翻译
      data = {}
      for (const [key, value] of Object.entries(zhMap)) {
        // 这里可以并发优化
        data[key] = await translate(value, locale)
      }
    }
    writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8')
    console.warn(`[生成] ${outPath}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
