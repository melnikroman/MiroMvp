import { buildOrthogonalRoute } from "./buildOrthogonalRoute.ts"
import type { DiagramModel } from "../types/DiagramModel.ts"

export function rerouteEdges(model: DiagramModel): DiagramModel {
  const nodeById = new Map(model.nodes.map((n) => [n.id, n]))

  return {
    ...model,
    edges: model.edges.map((edge) => {
      const fromNode = nodeById.get(edge.fromNodeId)
      const toNode = nodeById.get(edge.toNodeId)

      if (!fromNode || !toNode) return edge

      return {
        ...edge,
        points: buildOrthogonalRoute(fromNode, toNode, edge.points)
      }
    })
  }
}
