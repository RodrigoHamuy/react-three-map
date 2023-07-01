# react-three-map

## 0.2.1

### Patch Changes

- 71d6439: Fix maplibre build

## 0.2.0

### Minor Changes

- b210a12: Support to render `react-three-map` on demand via `<Canvas frameloop="ondemand">`
- 557920a: Add Mapbox support.

  - If you use **Mapbox** `import { Canvas } from "react-three-map"`
  - If you use **Maplibre** `import { Canvas } from "react-three-map/maplibre"`

### Patch Changes

- 83de85c: Fix camera matrix bug where it may have invalid state on start.
