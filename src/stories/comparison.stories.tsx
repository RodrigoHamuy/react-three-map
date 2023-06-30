import { ThemeState, useLadleContext } from "@ladle/react";
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl';
import { Canvas } from "../canvas/canvas-maplibre";
import { Canvas as FiberCanvas } from "@react-three/fiber"
import { MyScene } from "./my-scene";
import { MapControls } from "@react-three/drei"
import MapLibre from "maplibre-gl";

export function WithMap() {
  const theme = useLadleContext().globalState.theme;
  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  return <div style={{ height: '100vh' }}>
    <Map
      mapLib={MapLibre}
      antialias
      initialViewState={{
        latitude: 51.5073218,
        longitude: -0.1276473,
        zoom: 18,
        pitch: 60,
      }}
      mapStyle={mapStyle}
    >
      <Canvas latitude={51.5073218} longitude={-0.1276473} shadows="variance">
        <MyScene />
      </Canvas>
    </Map>
  </div>
}

export const WithoutMap = () => {
  return <div style={{ height: '100vh' }}>
    <FiberCanvas camera={{position: [100,100,100]}} shadows="variance">
      <MyScene />    
      <MapControls makeDefault />
    </FiberCanvas>
  </div>
}