import { Layer, Source } from 'react-map-gl';

export function SourceBuildings3D() {

  return <Source id="3d-buildings" type="vector" url="mapbox://mapbox.mapbox-streets-v8">
    <Layer
      id="3d-buildings"
      type="fill-extrusion"
      source-layer="building"
      minzoom={15}
      layout={{ visibility: 'none' }}
      filter={[
        "all",
        ["!=", ["get", "type"], "building:part"],
        ["==", ["get", "underground"], "false"],
      ]}
      paint={{
        "fill-extrusion-color": "#656565",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 1.0,
      }} />
  </Source>;

}
