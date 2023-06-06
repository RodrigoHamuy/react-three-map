import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl/maplibre';
import { UrbanAreas } from "../urban-areas";
import { VanillaThreeLayer } from "../vanilla-three-layer";

export function BasicSetup() {
  return <div style={{ height: '100vh' }}>
    <Map
      antialias
      initialViewState={{
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14
      }}
      // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
      <VanillaThreeLayer latitude={37.8} longitude={-122.4} />
      {/* <ThreeLayerLite latitude={37.8} longitude={-122.4}>
        <MyScene />
      </ThreeLayerLite> */}
      <UrbanAreas />
      <Marker latitude={37.8} longitude={-122.4} color="red" />
    </Map>
  </div>
}

