import { useCallback } from "react"
import { useMiroMvpContextProvider } from "../context.tsx"
import { rerouteEdges } from "../helpers/rerouteEdges.ts"
import type { DiagramModel } from "../types/DiagramModel.ts"
import type { Point } from "../types/Point.ts"

export function useDiagramController() {
  const { setModel } = useMiroMvpContextProvider()

  const moveNode = useCallback((nodeId: string, dx: number, dy: number) => {
    setModel((prev) => {
      const next: DiagramModel = {
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, x: n.x + dx, y: n.y + dy } : n))
      }

      return rerouteEdges(next)
    })
  }, [])

  const moveEdgePoint = useCallback((edgeId: string, pointIndex: number, nextPoint: Point) => {
    setModel((prev) => {
      const next: DiagramModel = {
        ...prev,
        edges: prev.edges.map((e) => {
          if (e.id !== edgeId) return e
          const points = e.points.map((p, i) => (i === pointIndex ? nextPoint : p))
          return { ...e, points }
        })
      }

      return rerouteEdges(next)
    })
  }, [])

  const insertEdgePoint = useCallback((edgeId: string, segmentIndex: number, point: Point) => {
    setModel((prev) => {
      const next: DiagramModel = {
        ...prev,
        edges: prev.edges.map((e) => {
          if (e.id !== edgeId) return e
          const points = [...e.points]
          points.splice(segmentIndex + 1, 0, point)
          return { ...e, points }
        })
      }

      return rerouteEdges(next)
    })
  }, [])

  const removeEdgePoint = useCallback((edgeId: string, pointIndex: number) => {
    setModel((prev) => {
      const next: DiagramModel = {
        ...prev,
        edges: prev.edges.map((e) => {
          if (e.id !== edgeId) return e
          if (e.points.length <= 4) return e
          return {
            ...e,
            points: e.points.filter((_, i) => i !== pointIndex)
          }
        })
      }

      return rerouteEdges(next)
    })
  }, [])

  return {
    moveNode,
    moveEdgePoint,
    insertEdgePoint,
    removeEdgePoint
  }
}
