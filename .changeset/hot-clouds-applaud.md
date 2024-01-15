---
"react-three-map": minor
---

- Peer dependency upgrade: `maplibre-gl`: `>=3.2`, so we don't need to sort `maplibre` old DPR bug anymore.
- Add `overlay?: boolean` to `<Canvas>`, so you can render on a separated canvas if preferred.
- Add `NearCoordinates` component.
- Add `coordsToVector3` function.