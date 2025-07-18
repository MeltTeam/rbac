/**
 * 判断字符串是否有空字符串
 * @param str 字符串
 */
export function hasSpace(str: string) {
  return str.includes(' ') || /\s/.test(str)
}

/**
 * 随机生成code
 * @param length 长度
 * @param type 类型
 * @returns
 */
export function getCode(length: number = 6, type: number = 16) {
  return Math.random()
    .toString(type)
    .substring(2, length + 2)
}
