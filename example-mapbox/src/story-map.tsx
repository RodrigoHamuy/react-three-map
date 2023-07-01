import { ThemeState, useLadleContext } from '@ladle/react';
import { useControls } from 'leva';
import Mapbox from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FC, PropsWithChildren } from "react";
import Map from 'react-map-gl';

export interface StoryMapProps extends PropsWithChildren {
  latitude: number,
  longitude: number,
  zoom?: number,
  pitch?: number,
}

/** `<Map>` styled for stories */
export const StoryMap: FC<StoryMapProps> = ({
  latitude, longitude, zoom = 18, pitch = 60, children
}) => {

  const { mapboxToken } = useControls({ mapboxToken: import.meta.env.VITE_MAPBOX_KEY || '' })

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/streets-v12";

  Mapbox.accessToken = mapboxToken;

  return <div style={{ height: '100vh', position: 'relative' }}>
    {!mapboxToken && <>Add a mapbox token to load this component</>}
    {mapboxToken && <Map
      antialias
      initialViewState={{
        latitude,
        longitude,
        zoom,
        pitch,
      }}
      mapStyle={mapStyle}
      mapboxAccessToken={mapboxToken}
    >
      {children}
    </Map>}
  </div>
}