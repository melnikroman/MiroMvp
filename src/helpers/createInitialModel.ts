import type { DiagramModel } from "../types/DiagramModel.ts"
import { rerouteEdges } from "./rerouteEdges.ts"

export function createInitialModel(): DiagramModel {
  const base: DiagramModel = {
    nodes: [
      { id: "n1", x: -260, y: -120, w: 150, h: 80, title: "Source" },
      { id: "n2", x: 40, y: -150, w: 170, h: 90, title: "Processor" },
      { id: "n3", x: 320, y: 40, w: 160, h: 80, title: "Storage" },
      { id: "n4", x: -40, y: 160, w: 100, h: 50, title: "UI" }
    ],
    edges: [
      { id: "e1", fromNodeId: "n1", toNodeId: "n2", points: [] },
      { id: "e2", fromNodeId: "n2", toNodeId: "n3", points: [] },
      { id: "e3", fromNodeId: "n2", toNodeId: "n4", points: [] }
    ]
  }

  return rerouteEdges(base)
}
