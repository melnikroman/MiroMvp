import { useEffect, useRef } from "react"
import { useMiroMvpContextProvider } from "../context.tsx"
import { fitToScreen } from "../helpers/fitToScreen.ts"

export const OnResizeEffect = () => {
  const didFitRef = useRef(false)
  const { setViewport, size, model } = useMiroMvpContextProvider()

  useEffect(() => {
    if (!didFitRef.current && size.width > 0 && size.height > 0) {
      setViewport(fitToScreen(model, size.width, size.height))
      didFitRef.current = true
    }
  }, [model, size.width, size.height])

  return null
}
