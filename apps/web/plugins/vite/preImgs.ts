import type { Plugin } from 'vite'
import { readdir } from 'node:fs/promises'
import { basename, extname, isAbsolute, resolve } from 'node:path'
import { cwd } from 'node:process'

interface IPreImgsOptions {
  dir: string
  type?: 'preload' | 'prefetch'
}

export function preImgs(options: IPreImgsOptions): Plugin {
  const { dir, type = 'preload' } = options
  return {
    name: 'vite-plugin-preload-img',
    enforce: 'post',
    async transformIndexHtml(html, ctx) {
      const rootDir = ctx?.server?.config?.root ?? cwd()
      const imgDir = isAbsolute(dir) ? dir : resolve(rootDir, dir)
      const tags: any[] = []
      try {
        const files = await readdir(imgDir)
        if (ctx.bundle) {
          // 产物模式，匹配带 hash 路径
          const bundleFiles = Object.keys(ctx.bundle)
          files.forEach((file) => {
            const ext = extname(file).replace('.', '')
            const name = basename(file, `.${ext}`)
            const reg = new RegExp(`static/${ext}/${name}-[\\w\\d]+\\.${ext}$`)
            const hashed = bundleFiles.find((f) => reg.test(f))
            if (hashed) {
              tags.push({
                tag: 'link',
                attrs: {
                  rel: type,
                  href: `/${hashed}`,
                  as: 'image',
                },
                injectTo: 'head',
              })
            }
          })
        } else {
          // 开发模式，直接用源路径
          files.forEach((file) => {
            tags.push({
              tag: 'link',
              attrs: {
                rel: type,
                href: `/src${dir.replace(/^src[\\/]/, '/')}/${file}`,
                as: 'image',
              },
              injectTo: 'head',
            })
          })
        }
        return tags
      } catch (_e) {
        console.error(_e)
        return html
      }
    },
  }
}
