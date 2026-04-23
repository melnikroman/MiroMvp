import { type PointerEvent, useCallback, useRef } from "react"
import { useMiroMvpContextProvider } from "../context.tsx"
import { screenToWorld } from "../helpers/screenToWorld.ts"
import type { Point } from "../types/Point.ts"
import { useDiagramController } from "./useDiagramController.ts"

export const useCanvas = () => {

  const { setSelected, model, viewport, setViewport } = useMiroMvpContextProvider()
  const { moveNode, moveEdgePoint } = useDiagramController()
  const interactionRef = useRef<InteractionState>(null)

  const getWorldFromEvent = useCallback(
    (e: PointerEvent<SVGSVGElement> | PointerEvent<SVGGElement> | PointerEvent<SVGCircleElement>) =>
      screenToWorld({ x: e.clientX, y: e.clientY }, viewport),
    [viewport]
  )

  const onNodePointerDown = useCallback(
    (e: PointerEvent<SVGGElement>, nodeId: string) => {
      if (e.button !== 0) return

      e.stopPropagation()
      setSelected({ type: "node", id: nodeId })

      const world = getWorldFromEvent(e)

      interactionRef.current = {
        type: "move-node",
        nodeId,
        startWorld: world,
        lastWorld: world,
        pointerId: e.pointerId
      }

      e.currentTarget.setPointerCapture?.(e.pointerId)
    },
    [getWorldFromEvent]
  )

  const onBackgroundPointerDown = useCallback((e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return

    setSelected({ type: null, id: null })

    interactionRef.current = {
      type: "pan",
      startClient: { x: e.clientX, y: e.clientY },
      pointerId: e.pointerId
    }

    e.currentTarget.setPointerCapture?.(e.pointerId)
  }, [])

  const onEdgePointPointerDown = useCallback(
    (e: PointerEvent<SVGCircleElement>, edgeId: string, pointIndex: number) => {
      const world = getWorldFromEvent(e)

      setSelected({ type: "edge", id: edgeId })

      interactionRef.current = {
        type: "move-edge-point",
        edgeId,
        pointIndex,
        startWorld: world,
        lastWorld: world,
        pointerId: e.pointerId
      }

      e.currentTarget.setPointerCapture?.(e.pointerId)
    },
    [getWorldFromEvent]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      const it = interactionRef.current
      if (!it) return

      if (it.type === "pan") {
        const dx = e.clientX - it.startClient.x
        const dy = e.clientY - it.startClient.y

        it.startClient = { x: e.clientX, y: e.clientY }

        setViewport((prev) => ({
          ...prev,
          panX: prev.panX + dx,
          panY: prev.panY + dy
        }))

        return
      }

      const world = getWorldFromEvent(e)
      const last = it.lastWorld
      const dx = world.x - last.x
      const dy = world.y - last.y
      it.lastWorld = world

      if (it.type === "move-node") {
        moveNode(it.nodeId, dx, dy)
      }

      if (it.type === "move-edge-point") {
        const edge = model.edges.find((ed) => ed.id === it.edgeId)
        if (!edge) return

        const oldPoint = edge.points[it.pointIndex]
        const prevPoint = edge.points[it.pointIndex - 1]
        const nextPoint = edge.points[it.pointIndex + 1]
        if (!oldPoint) return

        let nextPointPos: Point = {
          x: oldPoint.x + dx,
          y: oldPoint.y + dy
        }

        const prevAlignedX =
          !!prevPoint && Math.abs(prevPoint.x - oldPoint.x) < Math.abs(prevPoint.y - oldPoint.y)
        const nextAlignedX =
          !!nextPoint && Math.abs(nextPoint.x - oldPoint.x) < Math.abs(nextPoint.y - oldPoint.y)

        if (prevAlignedX || nextAlignedX) {
          nextPointPos = { x: oldPoint.x + dx, y: oldPoint.y }
        } else {
          nextPointPos = { x: oldPoint.x, y: oldPoint.y + dy }
        }

        moveEdgePoint(it.edgeId, it.pointIndex, nextPointPos)
      }
    },
    [moveEdgePoint, moveNode, getWorldFromEvent, model.edges]
  )

  const onPointerUp = useCallback((e: PointerEvent<SVGSVGElement>) => {
    if (interactionRef.current?.pointerId === e.pointerId) {
      interactionRef.current = null
    }
  }, [])

  return {
    onBackgroundPointerDown,
    onNodePointerDown,
    onEdgePointPointerDown,
    onPointerMove,
    onPointerUp
  }

}

type InteractionState =
  | null
  | {
  type: "pan";
  startClient: Point;
  pointerId: number;
}
  | {
  type: "move-node";
  nodeId: string;
  startWorld: Point;
  lastWorld: Point;
  pointerId: number;
}
  | {
  type: "move-edge-point";
  edgeId: string;
  pointIndex: number;
  startWorld: Point;
  lastWorld: Point;
  pointerId: number;
}
