import { useEffect, useRef } from "react"
import { useMiroMvpContextProvider } from "../context.tsx"

export const useContainerRef = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { setSize } = useMiroMvpContextProvider()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)

    return () => {
      ro.disconnect()
    }
  }, [])

  return {
    containerRef
  }
}
