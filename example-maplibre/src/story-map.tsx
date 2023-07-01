import { ThemeState, useLadleContext } from '@ladle/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FC, PropsWithChildren } from "react";
import Map from 'react-map-gl/maplibre';

export interface StoryMapProps extends PropsWithChildren {
  latitude: number,
  longitude: number,
  zoom?: number,
  pitch?: number,
}

/** `<Map>` styled for stories */
export const StoryMap: FC<StoryMapProps> = ({
  latitude, longitude, zoom, children
}) => {

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return <div style={{ height: '100vh', position: 'relative' }}>
    <Map
      antialias
      initialViewState={{
        latitude,
        longitude,
        zoom,
        pitch: 60,
      }}
      mapStyle={mapStyle}
    >
      {children}
    </Map>
  </div>
}