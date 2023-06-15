import { ThemeState, useLadleContext } from "@ladle/react";
import { Box, Stats } from "@react-three/drei";
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState } from "react";
import Map from 'react-map-gl/maplibre';
import { MathUtils } from "three";
import { Canvas } from "../canvas/canvas";

export function Default() {

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const [hovered, hover] = useState(false);

  return <div style={{ height: '100vh', position: 'relative' }}>
    <Map
      antialias
      initialViewState={{
        latitude: 51,
        longitude: 0,
        zoom: 13,
        pitch: 60,
      }}
      mapStyle={mapStyle}
    >
      <Canvas latitude={51} longitude={0}>
        <Box
          args={[500,500,500]}
          position={[0,250,0]}
          rotation={[0,45 * MathUtils.DEG2RAD,0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          material-color={hovered ? 'purple' : 'orange'}
        />
        <Stats />
      </Canvas>
    </Map>
    <div style={{position: 'absolute', top: 0, right: 0}}>
      Hover over the box, it will only render once to change colour, or when you move the camera. Look at the stats to confirm.
    </div>
  </div>
}