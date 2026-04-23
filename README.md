# Miro MVP

A minimal diagram editor inspired by Miro, built with **React + TypeScript + SVG** using an **MVC architecture**.

## Features

- infinite board
- pan navigation
- zoom from `10%` to `200%`
- draggable rectangular nodes
- orthogonal connector lines between nodes
- editable connectors:
    - drag inner control points
    - add new segments
    - remove segments
- automatic connector rerendering when model changes
- initial auto-fit and centering to viewport

## Architecture

The project follows the **MVC pattern**:

- **Model** — diagram state stored as an object with `nodes` and `edges`
- **Controller** — user actions modify the model
- **View** — SVG renders current model state

Main principle:

The mouse does **not** move DOM/SVG elements directly.  
Instead, interactions update the **model**, and the UI rerenders from state.

## Tech Stack

- React
- TypeScript
- Vite
- SVG

## Project Structure

```text
src/
  components/
    DiagramCanvas/
      index.tsx
      EdgeView.tsx
      Grid.tsx
      NodeView.tsx
    Header.tsx
    ModelSnapshot.tsx
    Summary.tsx

  hooks/
    useCanvas.ts
    useDiagramController.ts
    useContainerRef.ts
    useSvgRef.ts

  helpers/
    createInitialModel.ts
    screenToWorld.ts
    fitToScreen.ts
    rerouteEdges.ts
    buildOrthogonalRoute.ts
    rectBorderPoint.ts

  types/
    DiagramModel.ts
    EdgeModel.ts
    NodeModel.ts
    Point.ts
    Viewport.ts
    SelectedState.ts

  context.tsx
  App.tsx
  main.tsx
