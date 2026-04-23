import type { NodeModel } from "../types/NodeModel.ts"
import type { Point } from "../types/Point.ts"

export function buildOrthogonalRoute(
  fromNode: NodeModel,
  toNode: NodeModel,
  previousPoints?: Point[]
): Point[] {
  const fromCenter = rectCenter(fromNode)
  const toCenter = rectCenter(toNode)

  if (previousPoints && previousPoints.length >= 4) {
    const inner = previousPoints.slice(1, -1)
    const startToward = inner[0] ?? toCenter
    const endToward = inner[inner.length - 1] ?? fromCenter

    const start = rectBorderPoint(fromNode, startToward)
    const end = rectBorderPoint(toNode, endToward)

    return [start, ...inner, end]
  }

  const horizontalFirst =
    Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y)

  let p1: Point
  let p2: Point

  if (horizontalFirst) {
    const midX = (fromCenter.x + toCenter.x) / 2
    p1 = { x: midX, y: fromCenter.y }
    p2 = { x: midX, y: toCenter.y }
  } else {
    const midY = (fromCenter.y + toCenter.y) / 2
    p1 = { x: fromCenter.x, y: midY }
    p2 = { x: toCenter.x, y: midY }
  }

  const start = rectBorderPoint(fromNode, p1)
  const end = rectBorderPoint(toNode, p2)

  return [start, p1, p2, end]
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

function rectCenter(node: NodeModel): Point {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 }
}
