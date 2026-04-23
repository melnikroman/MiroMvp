import { useMiroMvpContextProvider } from "../context.tsx"
import { useEdgeSummary } from "../hooks/useEdgeSummary.ts"

export const ModelSnapshot = () => {
  const { model } = useMiroMvpContextProvider()
  const { edgeSummary } = useEdgeSummary()

  return <div
    style={{
      position: "absolute",
      right: 16,
      bottom: 16,
      width: 360,
      maxHeight: "42vh",
      overflow: "auto",
      background: "#0f172a",
      color: "#e2e8f0",
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(15,23,42,0.25)",
      padding: 16,
      fontSize: 12
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Model snapshot</div>
    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
            {JSON.stringify(model, null, 2)}
          </pre>
    <div
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: "1px solid rgba(148,163,184,0.25)",
        whiteSpace: "pre-wrap",
        color: "#cbd5e1"
      }}
    >
      {edgeSummary}
    </div>
  </div>
}
