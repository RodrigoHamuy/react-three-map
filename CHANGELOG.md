# react-three-map

## 0.8.2

### Patch Changes

- 58c42d9: - Improve accuracy at long distances for `coordsToVector3`.
  - Improve translation accuracy for `NearCoordinates`, but scale is still ignored.
  - Update `earthRadius` from `6378137` to `6371008.8` to match [Mapbox](https://github.com/maplibre/maplibre-gl-js/blob/8ea76118210dd18fa52fdb83f2cbdd1229807346/src/geo/lng_lat.ts#L8) and [Maplibre](https://github.com/maplibre/maplibre-gl-js/blob/main/src/geo/lng_lat.ts#L8).

## 0.8.1

### Patch Changes

- 9dfe4f6: Remove `turf` dependency.
- 9dfe4f6: Map to wait for r3f to finish rendering before the next render in overlay mode.

## 0.8.0

### Minor Changes

- 7e1743d: - Peer dependency upgrade: `maplibre-gl`: `>=3.2`, so we don't need to sort `maplibre` old DPR bug anymore.
  - Add `overlay?: boolean` to `<Canvas>`, so you can render on a separated canvas if preferred.
  - Add `NearCoordinates` component.
  - Add `coordsToVector3` function.

## 0.7.2

### Patch Changes

- 90a4766: Fix bug on DPR change.

## 0.7.1

### Patch Changes

- 2115617: Revert 748d7a7: Fix issues on DPR or browser zoom changes.

## 0.7.0

### Minor Changes

- 1c52c0f: `<Canvas>` props accepts `id?: string` and `beforeId?: string` to set the MapLibre/Mapbox layer.

### Patch Changes

- 748d7a7: Fix issues on DPR or browser zoom changes.

## 0.6.3

### Patch Changes

- a5b94b6: Fix ThreeJS sync on Mapbox resize.

## 0.6.2

### Patch Changes

- 6be61b6: Fix on window DPR changes (different solutions for Mapbox and Maplibre)

## 0.6.1

### Patch Changes

- be1efa7: Fix resizing bug when DPR changes.

## 0.6.0

### Minor Changes

- 3a9a852: Add `useMap` hook to access the map from react-three-map.

### Patch Changes

- 3a9a852: Better type for `useMap`.

## 0.5.0

### Minor Changes

- 7921f43: Add `useMap` hook to access the map from react-three-map.

## 0.4.3

### Patch Changes

- 0e37c1c: Fix canvas on resize.

## 0.4.2

### Patch Changes

- bd62ef9: Simplify raycaster calculations.

## 0.4.1

### Patch Changes

- 41dd225: Improve camera decomposition so the camera matrix and world matrix have more useful values.

## 0.4.0

### Minor Changes

- bad8670: Add `<Coordinates>` component to render multiple 3D objects at different coordiantes.

## 0.3.5

### Patch Changes

- 9b1c068: Fix camera matrix calculations.

## 0.3.4

### Patch Changes

- 4dd8a72: Fix types declaration path.

## 0.3.3

### Patch Changes

- 7e94458: Generate types declarations.

## 0.3.2

### Patch Changes

- b169844: Bug fix related to DPR devices and pointer events.

## 0.3.1

### Patch Changes

- 39acb3b: Fix build typo and add more detailed peer dependencies.

## 0.3.0

### Minor Changes

- f3155c6: Upgrade to `react-map-gl@7.1.0`, which changes how to use Maplibre. Find more in their [changelog](https://github.com/visgl/react-map-gl/releases/tag/v7.1.0).

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
