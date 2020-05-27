export interface Color {
  r: number
  g: number
  b: number
}

export function colorToStyle(color: Color): string {
  const { r, g, b } = color
  return `rgb(${r},${g},${b})`
}
