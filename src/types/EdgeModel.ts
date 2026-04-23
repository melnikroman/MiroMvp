import type { Point } from "./Point.ts"

export type EdgeModel = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  points: Point[];
}
