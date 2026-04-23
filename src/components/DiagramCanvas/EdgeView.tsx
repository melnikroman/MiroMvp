import type { PointerEvent, ReactNode } from "react"
import { useMiroMvpContextProvider } from "../../context.tsx"
import type { EdgeModel } from "../../types/EdgeModel.ts"
import type { Point } from "../../types/Point.ts"

export function EdgeView({
                    edge,
                    selected,
                    onSelect,
                    onPointPointerDown,
                    onInsertPoint,
                    onRemovePoint
                  }: {
  edge: EdgeModel;
  selected: boolean;
  onSelect: (edgeId: string) => void;
  onPointPointerDown: (e: PointerEvent<SVGCircleElement>, edgeId: string, pointIndex: number) => void;
  onInsertPoint: (edgeId: string, segmentIndex: number, point: Point) => void;
  onRemovePoint: (edgeId: string, pointIndex: number) => void;
}) {
  const { viewport } = useMiroMvpContextProvider()

  const pts = edge.points
  const path = pts.map((p) => `${p.x},${p.y}`).join(" ")

  const interiorIndices: number[] = []
  for (let i = 1; i < pts.length - 1; i += 1) {
    interiorIndices.push(i)
  }

  const midHandles: ReactNode[] = []
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i]
    const b = pts[i + 1]
    const mid = segmentMidpoint(a, b)

    midHandles.push(
      <circle
        key={`mid-${edge.id}-${i}`}
        cx={mid.x}
        cy={mid.y}
        r={7 / viewport.zoom}
        fill="white"
        stroke="rgba(2,132,199,0.9)"
        strokeWidth={1.5 / viewport.zoom}
        style={{ cursor: "copy" }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onInsertPoint(edge.id, i, mid)
        }}
      />
    )
  }

  return (
    <g>
      <polyline
        points={path}
        fill="none"
        stroke={selected ? "rgba(2,132,199,1)" : "rgba(30,41,59,0.85)"}
        strokeWidth={1.5 / viewport.zoom}
        strokeLinejoin="round"
        strokeLinecap="round"
        onPointerDown={(e) => {
          e.stopPropagation()
          onSelect(edge.id)
        }}
      />

      <polyline
        points={path}
        fill="none"
        stroke="transparent"
        strokeWidth={18 / viewport.zoom}
        strokeLinejoin="round"
        strokeLinecap="round"
        onPointerDown={(e) => {
          e.stopPropagation()
          onSelect(edge.id)
        }}
      />

      {selected && midHandles}

      {selected &&
        interiorIndices.map((i) => {
          const p = pts[i]
          return (
            <circle
              key={`point-${edge.id}-${i}`}
              cx={p.x}
              cy={p.y}
              r={8 / viewport.zoom}
              fill="white"
              stroke="rgba(15,23,42,0.9)"
              strokeWidth={2 / viewport.zoom}
              style={{ cursor: "grab" }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                onRemovePoint(edge.id, i)
              }}
              onPointerDown={(e) => {
                e.stopPropagation()
                onPointPointerDown(e, edge.id, i)
              }}
            />
          )
        })}
    </g>
  )
}

function segmentMidpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
