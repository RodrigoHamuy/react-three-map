import { useControls } from 'leva';
import { Layer, Source } from 'react-map-gl';

export function SourceBuildings3D() {

  const {visibility} = useControls({visibility: false})
  
  return <Source id="3d-buildings" type="vector" url="mapbox://mapbox.mapbox-streets-v8">
  <Layer
    id="3d-buildings"
    type="fill-extrusion"
    source-layer="building"
    minzoom={15}
    layout={{ visibility: visibility ? 'visible' : 'none' }}
    filter={[
      "all",
      // ["!=", ["get", "type"], "building"],
      ["!=", ["get", "type"], "building:part"],
      ["==", ["get", "underground"], "false"],
    ]}
    paint={{
      "fill-extrusion-color": "#656565",
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-base": ["get", "min_height"],
      "fill-extrusion-opacity": 1.0,
    }} />
</Source>;

}
