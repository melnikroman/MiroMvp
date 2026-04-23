import type { NodeModel } from "../types/NodeModel.ts"
import type { Point } from "../types/Point.ts"

type Rect = {
  x: number
  y: number
  w: number
  h: number
}

const ROUTE_MARGIN = 16

function rectCenter(node: NodeModel): Point {
  return {
    x: node.x + node.w / 2,
    y: node.y + node.h / 2
  }
}

function getRect(node: NodeModel): Rect {
  return {
    x: node.x,
    y: node.y,
    w: node.w,
    h: node.h
  }
}

function expandRect(rect: Rect, margin: number): Rect {
  return {
    x: rect.x - margin,
    y: rect.y - margin,
    w: rect.w + margin * 2,
    h: rect.h + margin * 2
  }
}

function rectBorderPoint(node: NodeModel, toward: Point): Point {
  const cx = node.x + node.w / 2
  const cy = node.y + node.h / 2
  const dx = toward.x - cx
  const dy = toward.y - cy

  if (dx === 0 && dy === 0) {
    return { x: cx, y: cy }
  }

  const halfW = node.w / 2
  const halfH = node.h / 2

  const tx = dx !== 0 ? halfW / Math.abs(dx) : Number.POSITIVE_INFINITY
  const ty = dy !== 0 ? halfH / Math.abs(dy) : Number.POSITIVE_INFINITY
  const t = Math.min(tx, ty)

  return {
    x: cx + dx * t,
    y: cy + dy * t
  }
}

function isPointInsideRect(point: Point, rect: Rect): boolean {
  return (
    point.x > rect.x &&
    point.x < rect.x + rect.w &&
    point.y > rect.y &&
    point.y < rect.y + rect.h
  )
}

function segmentIntersectsRect(a: Point, b: Point, rect: Rect): boolean {
  if (isPointInsideRect(a, rect) || isPointInsideRect(b, rect)) {
    return true
  }

  const left = rect.x
  const right = rect.x + rect.w
  const top = rect.y
  const bottom = rect.y + rect.h

  if (a.x === b.x) {
    const x = a.x
    if (x <= left || x >= right) return false

    const minY = Math.min(a.y, b.y)
    const maxY = Math.max(a.y, b.y)

    return maxY > top && minY < bottom
  }

  if (a.y === b.y) {
    const y = a.y
    if (y <= top || y >= bottom) return false

    const minX = Math.min(a.x, b.x)
    const maxX = Math.max(a.x, b.x)

    return maxX > left && minX < right
  }

  return false
}

function pathIntersectsRects(points: Point[], rects: Rect[]): boolean {
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]
    const b = points[i + 1]

    for (const rect of rects) {
      if (segmentIntersectsRect(a, b, rect)) {
        return true
      }
    }
  }

  return false
}

function dedupeSequentialPoints(points: Point[]): Point[] {
  const result: Point[] = []

  for (const point of points) {
    const last = result[result.length - 1]
    if (!last || last.x !== point.x || last.y !== point.y) {
      result.push(point)
    }
  }

  return result
}

function pathLength(points: Point[]): number {
  let total = 0

  for (let i = 0; i < points.length - 1; i += 1) {
    total += Math.abs(points[i + 1].x - points[i].x) + Math.abs(points[i + 1].y - points[i].y)
  }

  return total
}

function buildCandidatePath(
  fromNode: NodeModel,
  toNode: NodeModel,
  mode: "top" | "bottom" | "left" | "right"
): Point[] {
  const fromCenter = rectCenter(fromNode)
  const toCenter = rectCenter(toNode)

  const fromRect = getRect(fromNode)
  const toRect = getRect(toNode)

  const expandedFrom = expandRect(fromRect, ROUTE_MARGIN)
  const expandedTo = expandRect(toRect, ROUTE_MARGIN)

  let inner: Point[]

  if (mode === "top") {
    const y = Math.min(expandedFrom.y, expandedTo.y) - ROUTE_MARGIN
    inner = [
      { x: fromCenter.x, y },
      { x: toCenter.x, y }
    ]
  } else if (mode === "bottom") {
    const y =
      Math.max(expandedFrom.y + expandedFrom.h, expandedTo.y + expandedTo.h) + ROUTE_MARGIN
    inner = [
      { x: fromCenter.x, y },
      { x: toCenter.x, y }
    ]
  } else if (mode === "left") {
    const x = Math.min(expandedFrom.x, expandedTo.x) - ROUTE_MARGIN
    inner = [
      { x, y: fromCenter.y },
      { x, y: toCenter.y }
    ]
  } else {
    const x =
      Math.max(expandedFrom.x + expandedFrom.w, expandedTo.x + expandedTo.w) + ROUTE_MARGIN
    inner = [
      { x, y: fromCenter.y },
      { x, y: toCenter.y }
    ]
  }

  const start = rectBorderPoint(fromNode, inner[0])
  const end = rectBorderPoint(toNode, inner[inner.length - 1])

  return dedupeSequentialPoints([start, ...inner, end])
}

export function buildOrthogonalRoute(
  fromNode: NodeModel,
  toNode: NodeModel,
  previousPoints?: Point[]
): Point[] {
  if (previousPoints && previousPoints.length >= 4) {
    const inner = previousPoints.slice(1, -1)
    const startToward = inner[0]
    const endToward = inner[inner.length - 1]

    if (startToward && endToward) {
      const start = rectBorderPoint(fromNode, startToward)
      const end = rectBorderPoint(toNode, endToward)
      const reused = dedupeSequentialPoints([start, ...inner, end])

      const fromRect = expandRect(getRect(fromNode), 2)
      const toRect = expandRect(getRect(toNode), 2)

      if (!pathIntersectsRects(reused, [fromRect, toRect])) {
        return reused
      }
    }
  }

  const candidates = [
    buildCandidatePath(fromNode, toNode, "top"),
    buildCandidatePath(fromNode, toNode, "bottom"),
    buildCandidatePath(fromNode, toNode, "left"),
    buildCandidatePath(fromNode, toNode, "right")
  ]

  const fromRect = expandRect(getRect(fromNode), 2)
  const toRect = expandRect(getRect(toNode), 2)

  const valid = candidates.filter((candidate) => !pathIntersectsRects(candidate, [fromRect, toRect]))

  if (valid.length > 0) {
    return valid.sort((a, b) => pathLength(a) - pathLength(b))[0]
  }

  return candidates.sort((a, b) => pathLength(a) - pathLength(b))[0]
}
