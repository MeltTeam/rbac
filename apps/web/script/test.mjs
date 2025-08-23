import chroma from 'chroma-js'

export function getHsl(color) {
  console.warn(color)
  const hslColor = chroma(color).hsl()
  const hslC = {
    h: hslColor[0],
    s: hslColor[1] * 100,
    l: hslColor[2] * 100,
  }
  return hslC
}
console.warn(getHsl('#121418'))
