/**
 * 预加载单个图片，支持超时和自动重试
 * @param url 图片地址
 * @param fallback 备用地址
 * @param timeout 超时时间（毫秒）
 */
export function preloadImage(url: string, fallback?: string, timeout = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    let timer: number | undefined

    img.onload = () => {
      clearTimeout(timer)
      resolve(img)
    }
    img.onerror = () => {
      clearTimeout(timer)
      if (fallback && fallback !== url) {
        // 尝试备用地址
        preloadImage(fallback, undefined, timeout).then(resolve).catch(reject)
      } else {
        reject(new Error(`图片加载失败: ${url}`))
      }
    }
    timer = window.setTimeout(() => {
      img.onload = null
      img.onerror = null
      reject(new Error(`图片加载超时: ${url}`))
    }, timeout)
    img.src = url
  })
}

/** 图片地址对象 */
export interface IImgUrls {
  /** 主地址 */
  url: string
  /** 备用地址 */
  fallback?: string
}

/**
 * 批量预加载图片，首页优化
 * @param urls 图片地址数组
 * @param timeout 单张图片超时时间（毫秒）
 */
export async function preloadImages(urls: IImgUrls[], timeout = 8000): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(({ url, fallback }) => preloadImage(url, fallback, timeout)))
}
