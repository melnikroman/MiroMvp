import { clamp } from "./clamp.ts"
import type { DiagramModel } from "../types/DiagramModel.ts"
import type { Viewport } from "../types/Viewport.ts"

export function fitToScreen(model: DiagramModel, width: number, height: number, padding = 80): Viewport {
  if (!width || !height || model.nodes.length === 0) {
    return { zoom: 1, panX: width / 2, panY: height / 2 }
  }

  const allXs: number[] = []
  const allYs: number[] = []

  for (const n of model.nodes) {
    allXs.push(n.x, n.x + n.w)
    allYs.push(n.y, n.y + n.h)
  }

  for (const e of model.edges) {
    for (const p of e.points) {
      allXs.push(p.x)
      allYs.push(p.y)
    }
  }

  const minX = Math.min(...allXs)
  const maxX = Math.max(...allXs)
  const minY = Math.min(...allYs)
  const maxY = Math.max(...allYs)

  const contentW = Math.max(1, maxX - minX)
  const contentH = Math.max(1, maxY - minY)

  const zoomX = (width - padding * 2) / contentW
  const zoomY = (height - padding * 2) / contentH
  const zoom = clamp(Math.min(zoomX, zoomY, 2), 0.1, 2)

  const contentCx = (minX + maxX) / 2
  const contentCy = (minY + maxY) / 2

  return {
    zoom,
    panX: width / 2 - contentCx * zoom,
    panY: height / 2 - contentCy * zoom
  }
}
