import { useMiroMvpContextProvider } from "../context.tsx"
import { fitToScreen } from "../helpers/fitToScreen.ts"

export const Header = () => {
  const { setViewport, viewport, size, model } = useMiroMvpContextProvider()

  return <div
    style={{
      flexShrink: 0,
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      background: "rgba(255,255,255,0.96)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16
    }}
  >
    <div>
      <div style={{ fontWeight: 700, fontSize: 18 }}>MVP diagram editor</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>
        MVC, infinite board, pan/zoom, draggable nodes, editable orthogonal edges
      </div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={() => setViewport(fitToScreen(model, size.width, size.height))}
        style={{
          padding: "8px 12px",
          borderRadius: 12,
          border: "1px solid #cbd5e1",
          background: "white",
          cursor: "pointer"
        }}
      >
        Fit to screen
      </button>

      <div
        style={{
          minWidth: 90,
          textAlign: "center",
          padding: "8px 12px",
          borderRadius: 12,
          background: "#0f172a",
          color: "white",
          fontWeight: 600
        }}
      >
        {Math.round(viewport.zoom * 100)}%
      </div>
    </div>
  </div>
}
