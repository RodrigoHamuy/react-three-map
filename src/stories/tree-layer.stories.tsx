import { ThemeState, useLadleContext } from "@ladle/react";
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl/maplibre';
import { Canvas } from "../canvas/canvas";
import { MyScene } from "./my-scene";

export function BasicSetup() {
  const theme = useLadleContext().globalState.theme;
  const mapStyle = theme === ThemeState.Dark 
  ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
  : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  return <div style={{ height: '100vh' }}>
    <Map
      antialias
      initialViewState={{
        latitude: 51.5073218,
        longitude: -0.1276473,
        zoom: 22
      }}
      mapStyle={mapStyle}
    >
      <Canvas latitude={51.5073218} longitude={-0.1276473}>
        <MyScene blend />
      </Canvas>
    </Map>
  </div>
}

