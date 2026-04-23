export type SelectedState =
  | { type: null, id: null }
  | { type: "node", id: string }
  | { type: "edge", id: string }
