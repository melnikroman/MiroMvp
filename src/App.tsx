import { DiagramCanvas } from "./components/DiagramCanvas"
import { Header } from "./components/Header.tsx"
import { ModelSnapshot } from "./components/ModelSnapshot.tsx"
import { Summary } from "./components/Summary.tsx"
import { MainLayout } from "./styled/MainLayout.tsx"
import { MiroMvpContextProvider } from "./context.tsx"
import { OnResizeEffect } from "./effects/OnResizeEffect.ts"

export default function App() {

  return <MiroMvpContextProvider>
    <OnResizeEffect />

    <MainLayout>
      <Header />
      <DiagramCanvas />
      <Summary />
      <ModelSnapshot />
    </MainLayout>
  </MiroMvpContextProvider>
}
