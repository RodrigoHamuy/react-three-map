import 'maplibre-gl/dist/maplibre-gl.css';
import { FC, PropsWithChildren } from "react"
import MapLibre from "maplibre-gl";
import Map from 'react-map-gl';
import { useLadleContext, ThemeState } from '@ladle/react';

export interface StoryMapProps extends PropsWithChildren {
  latitude?: number,
  longitude?: number,
  zoom?: number,
  pitch?: number,
}

/** `<Map>` styled for stories */
export const StoryMap: FC<StoryMapProps> = ({
  children
}) => {

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return <div style={{ height: '100vh', position: 'relative' }}>
    <Map
      mapLib={MapLibre}
      antialias
      initialViewState={{
        latitude: 51,
        longitude: 0,
        zoom: 13,
        pitch: 60,
      }}
      mapStyle={mapStyle}
    >
      {children}
      </Map>
  </div>
}