import { useControls } from 'leva';
import { Layer } from 'react-map-gl';

export function SourceBuildings3D() {

  const {visibility} = useControls({visibility: false})
  
  return <Layer
    id="3d-buildings"
    type="fill-extrusion"
    source="composite"
    source-layer="building"
    minzoom={15}
    layout={{ visibility: visibility ? 'visible' : 'none' }}
    filter={['==', 'extrude', 'true']}
    paint={{
      "fill-extrusion-color": "#656565",
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-base": ["get", "min_height"],
      "fill-extrusion-opacity": 1.0,
    }} />

}
