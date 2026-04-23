import { createContext, type PropsWithChildren, type SetStateAction, useContext, useState } from "react"
import { createInitialModel } from "./helpers/createInitialModel.ts"
import type { DiagramModel } from "./types/DiagramModel.ts"
import type { SelectedState } from "./types/SelectedState.ts"
import type { Viewport } from "./types/Viewport.ts"

const Context = createContext<IContext>({} as IContext)

export const MiroMvpContextProvider = ({ children }: PropsWithChildren) => {
  const [size, setSize] = useState({ width: 1200, height: 800 })
  const [viewport, setViewport] = useState<Viewport>({ zoom: 1, panX: 0, panY: 0 })
  const [selected, setSelected] = useState<SelectedState>({ type: null, id: null })
  const [model, setModel] = useState<DiagramModel>(() => createInitialModel())

  return <Context.Provider value={{
    size,
    viewport,
    selected,
    model,

    setSize,
    setViewport,
    setSelected,
    setModel
  }}>
    {children}
  </Context.Provider>
}

export const useMiroMvpContextProvider = () => useContext(Context)

type IContext = {
  size: { width: number; height: number }
  viewport: Viewport
  selected: SelectedState
  model: DiagramModel

  setSize: (value: SetStateAction<{ width: number; height: number }>) => void
  setViewport: (value: SetStateAction<Viewport>) => void
  setSelected: (value: SetStateAction<SelectedState>) => void
  setModel: (value: SetStateAction<DiagramModel>) => void
}
