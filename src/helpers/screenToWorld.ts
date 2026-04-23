import type { Viewport } from "../types/Viewport.ts"
import type { Point } from "../types/Point.ts"

export function screenToWorld(screen: Point, viewport: Viewport): Point {
  return {
    x: (screen.x - viewport.panX) / viewport.zoom,
    y: (screen.y - viewport.panY) / viewport.zoom
  }
}
