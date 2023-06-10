import { ThemeState, useLadleContext } from "@ladle/react";
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl/maplibre';
import { VanillaThreeLayer } from "../vanilla-three-layer";
import { Box } from "@react-three/drei";
import { Canvas } from "../canvas";

export function BasicSetup() {
  const theme = useLadleContext().globalState.theme;
  const mapStyle = theme === ThemeState.Dark 
  ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
  : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  return <div style={{ height: '100vh' }}>
    <Map
      antialias
      initialViewState={{
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14
      }}
      mapStyle={mapStyle}
    >
      <VanillaThreeLayer latitude={37.8} longitude={-122.4} />
      <VanillaThreeLayer latitude={37.8} longitude={-122.403} />
      <Canvas latitude={37.8} longitude={-122.403}>
        <Box args={[100,500,100]} material-color="orange" />
      </Canvas>
      {/* <ThreeLayerLite latitude={37.8} longitude={-122.4}>
        <MyScene />
      </ThreeLayerLite> */}
      <Marker latitude={37.8} longitude={-122.4} color="red" />
    </Map>
  </div>
}

