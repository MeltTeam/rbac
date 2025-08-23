export function hexToRgb(hex: string) {
  hex = hex.replace('#', '')
  if (hex.length !== 6) {
    throw new Error('Invalid hex color value')
  }
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}
