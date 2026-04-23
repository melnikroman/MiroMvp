import type { ReactNode } from "react"
import { useMiroMvpContextProvider } from "../../context.tsx"
import { screenToWorld } from "../../helpers/screenToWorld.ts"

export const Grid = () => {
  const { size: { width, height }, viewport } = useMiroMvpContextProvider()

  const step = 80
  const topLeft = screenToWorld({ x: 0, y: 0 }, viewport)
  const bottomRight = screenToWorld({ x: width, y: height }, viewport)

  const startX = Math.floor(topLeft.x / step) * step
  const endX = Math.ceil(bottomRight.x / step) * step
  const startY = Math.floor(topLeft.y / step) * step
  const endY = Math.ceil(bottomRight.y / step) * step

  const lines: ReactNode[] = []

  for (let x = startX; x <= endX; x += step) {
    lines.push(
      <line
        key={`vx-${x}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={endY}
        stroke="rgba(148,163,184,0.18)"
        strokeWidth={1 / viewport.zoom}
      />
    )
  }

  for (let y = startY; y <= endY; y += step) {
    lines.push(
      <line
        key={`hy-${y}`}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke="rgba(148,163,184,0.18)"
        strokeWidth={1 / viewport.zoom}
      />
    )
  }

  return <g>{lines}</g>
}
