import { useMiroMvpContextProvider } from "../../context.tsx"
import { useCanvas } from "../../hooks/useCanvas.ts"
import { useContainerRef } from "../../hooks/useContainerRef.ts"
import { useDiagramController } from "../../hooks/useDiagramController.ts"
import { useSvgRef } from "../../hooks/useSvgRef.ts"
import { EdgeView } from "./EdgeView.tsx"
import { Grid } from "./Grid.tsx"
import { NodeView } from "./NodeView.tsx"

export const DiagramCanvas = () => {
  const { removeEdgePoint, insertEdgePoint } = useDiagramController()

  const { svgRef } = useSvgRef()
  const { containerRef } = useContainerRef()

  const { setSelected, selected, model, viewport } = useMiroMvpContextProvider()

  const {
    onNodePointerDown,
    onBackgroundPointerDown,
    onEdgePointPointerDown,
    onPointerUp,
    onPointerMove
  } = useCanvas()

  return <div ref={containerRef} style={{ position: "relative", flex: 1, overflow: "hidden" }}>
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, touchAction: "none", display: "block" }}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <g transform={`translate(${viewport.panX}, ${viewport.panY}) scale(${viewport.zoom})`}>
        <Grid />

        {model.edges.map((edge) => (
          <EdgeView
            key={edge.id}
            edge={edge}
            selected={selected.type === "edge" && selected.id === edge.id}
            onSelect={(edgeId) => setSelected({ type: "edge", id: edgeId })}
            onPointPointerDown={onEdgePointPointerDown}
            onInsertPoint={insertEdgePoint}
            onRemovePoint={removeEdgePoint}
          />
        ))}

        {model.nodes.map((node) => (
          <NodeView
            key={node.id}
            node={node}
            selected={selected.type === "node" && selected.id === node.id}
            onSelect={(nodeId) => setSelected({ type: "node", id: nodeId })}
            onPointerDown={(e) => onNodePointerDown(e, node.id)}
          />
        ))}
      </g>
    </svg>
  </div>
}
