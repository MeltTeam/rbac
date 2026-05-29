/**
 * 将驼峰命名转换为下划线命名
 * @param str 驼峰命名字符串
 * @returns 下划线命名字符串
 */
export function camelToSnake(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '')
}

/**
 * 将路径转换为权限码
 * @param path 文件路径
 * @returns 权限码
 */
export function pathToPermissionCode(path: string): string {
  const startPath = ['/src/pages/', '/src/layouts/', '/src/components/']
  return startPath
    .reduce((prev, item) => prev.replace(item, ''), path)
    .replace('/index.vue', '')
    .replace('.vue', '')
    .split('/')
    .map(camelToSnake)
    .join('_')
}
