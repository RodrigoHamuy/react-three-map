import { ThemeState, useLadleContext } from '@ladle/react';
import MapLibre from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { FC } from "react";
import Map from 'react-map-gl/maplibre';
import { StoryMapProps } from '../story-map';
import { Canvas } from 'react-three-map/maplibre';

/** Maplibre `<Map>` styled for stories */
export const StoryMaplibre: FC<StoryMapProps> = ({
  latitude, longitude, zoom, pitch, canvas, children
}) => {

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return <div style={{ height: '100vh', position: 'relative' }}>
    <Map
      mapLib={MapLibre}
      antialias
      initialViewState={{ latitude, longitude, zoom, pitch, }}
      mapStyle={mapStyle}
    >
      <Canvas latitude={latitude} longitude={longitude} {...canvas}>
        {children}
      </Canvas>
      </Map>
  </div>
}