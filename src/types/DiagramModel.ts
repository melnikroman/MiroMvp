import type { EdgeModel } from "./EdgeModel.ts"
import type { NodeModel } from "./NodeModel.ts"

export type DiagramModel = {
  nodes: NodeModel[]
  edges: EdgeModel[]
}
