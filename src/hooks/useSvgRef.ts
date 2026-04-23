import { useCallback, useEffect, useRef } from "react"
import { useMiroMvpContextProvider } from "../context.tsx"
import { clamp } from "../helpers/clamp.ts"
import { screenToWorld } from "../helpers/screenToWorld.ts"

export const useSvgRef = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  const { viewport, setViewport } = useMiroMvpContextProvider()

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return

      const cursorScreen = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }

      const worldBefore = screenToWorld(cursorScreen, viewport)
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      const nextZoom = clamp(viewport.zoom * factor, 0.1, 2)
      const nextPanX = cursorScreen.x - worldBefore.x * nextZoom
      const nextPanY = cursorScreen.y - worldBefore.y * nextZoom

      setViewport({
        zoom: nextZoom,
        panX: nextPanX,
        panY: nextPanY
      })
    },
    [setViewport, viewport]
  )

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const listener = (event: WheelEvent) => {
      handleWheel(event)
    }

    svg.addEventListener("wheel", listener, { passive: false })

    return () => {
      svg.removeEventListener("wheel", listener)
    }

  }, [handleWheel])

  return { svgRef }
}
