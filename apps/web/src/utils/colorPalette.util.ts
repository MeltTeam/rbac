import chroma from 'chroma-js'

export interface IColorPalette {
  num: number
  color: string
  text: string
}

/** 获取hsl */
export function getHsl(color: string) {
  const hslColor = chroma(color).hsl()
  const hslC = {
    h: hslColor[0],
    s: hslColor[1] * 100,
    l: hslColor[2] * 100,
  }
  return hslC
}
/**
 * 16进制转rgb
 * @param hex 16进制颜色值
 */
export function hexToRgb(hex: string) {
  if (hex.length !== 7 && !hex.startsWith('#')) {
    throw new Error('Invalid hex color value')
  }
  const r = Number.parseInt(hex.substring(1, 3), 16)
  const g = Number.parseInt(hex.substring(3, 5), 16)
  const b = Number.parseInt(hex.substring(5, 7), 16)
  return `${r} ${g} ${b}`
}
/**
 * 生成颜色调色盘
 * @param primaryColor 主题颜色
 */
export function generatePalette(primaryColor: string) {
  const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const len = colorPaletteNumbers.length
  const min = 10
  const max = 95
  const part = (max - min) / len
  const colorPalette: IColorPalette[] = []
  const primaryIndex = Math.floor(len / 2)
  const hsl = getHsl(primaryColor)
  if (hsl.l < min) hsl.l = min
  if (hsl.l > max) hsl.l = max
  colorPaletteNumbers.forEach((num, i) => {
    let hslCss = `hsl(${Object.is(Number.NaN, hsl.h) ? 0 : hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    if (i !== primaryIndex) {
      const gap = Math.abs(primaryIndex - i)
      const l = i > primaryIndex ? hsl.l - gap * part : hsl.l + gap * part
      hslCss = `hsl(${Object.is(Number.NaN, hsl.h) ? 0 : hsl.h}, ${hsl.s}%, ${l}%)`
      const hex = chroma(hslCss).hex()
      const text = chroma.mix(l < 50 ? 'white' : 'black', hex, 0.5).hex()
      colorPalette.push({ num, color: hex, text })
      return
    }
    const hex = chroma(hslCss).hex()
    const text = chroma.mix(hsl.l < 50 ? 'white' : 'black', hex, 0.5).hex()
    colorPalette.push({ num, color: primaryColor, text })
  })
  return colorPalette
}
