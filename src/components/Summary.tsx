import { styled } from "@mui/material"

export const Summary = () => {
  return <Wrapper>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>Controls</div>
    <div>• Left click on empty space — move the board</div>
    <div>• Mouse wheel — zoom 10%..200%</div>
    <div>• Left click on a block — drag the block</div>
    <div>• Left click on a line — select the line</div>
    <div>• White points — drag a segment</div>
    <div>• Blue points between segments — add a segment</div>
    <div>• Double click on an inner point — remove a segment</div>
  </Wrapper>
}

const Wrapper = styled("div")({
  position: "absolute",
  left: 16,
  bottom: 16,
  maxWidth: 430,
  background: "rgba(255,255,255,0.95)",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
  padding: 16,
  fontSize: 14,
  lineHeight: 1.6
})
