import type { PointerEvent } from "react"
import type { NodeModel } from "../../types/NodeModel.ts"

export const NodeView = ({
                           node,
                           selected,
                           onPointerDown,
                           onSelect
                         }: {
  node: NodeModel;
  selected: boolean;
  onPointerDown: (e: PointerEvent<SVGGElement>) => void;
  onSelect: (nodeId: string) => void;
}) => {
  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onPointerDown={onPointerDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(node.id)
      }}
      style={{ cursor: "grab" }}
    >
      <rect
        width={node.w}
        height={node.h}
        rx={14}
        fill={selected ? "rgba(224,242,254,1)" : "white"}
        stroke={selected ? "rgba(2,132,199,1)" : "rgba(15,23,42,0.55)"}
        strokeWidth={1}
      />
      <text
        x={node.w / 2}
        y={node.h / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={16}
        fill="rgba(15,23,42,0.95)"
        style={{ userSelect: "none" }}
      >
        {node.title}
      </text>
    </g>
  )
}
