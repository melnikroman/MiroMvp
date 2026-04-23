import { useMemo } from "react"
import { useMiroMvpContextProvider } from "../context.tsx"

export const useEdgeSummary = () => {
  const { model } = useMiroMvpContextProvider()

  const edgeSummary = useMemo(() => {
    return model.edges
      .map((e) => `${e.id}: ${e.fromNodeId} -> ${e.toNodeId}, points=${e.points.length}`)
      .join("\n")
  }, [model.edges])

  return { edgeSummary }
}
