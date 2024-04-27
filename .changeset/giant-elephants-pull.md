---
"react-three-map": patch
---

- Improve accuracy at long distances for `coordsToVector3`.
- Improve translation accuracy for `NearCoordinates`, but scale is still ignored.
- Update `earthRadius` from `6378137` to `6371008.8` to match [Mapbox](https://github.com/maplibre/maplibre-gl-js/blob/8ea76118210dd18fa52fdb83f2cbdd1229807346/src/geo/lng_lat.ts#L8) and [Maplibre](https://github.com/maplibre/maplibre-gl-js/blob/main/src/geo/lng_lat.ts#L8).