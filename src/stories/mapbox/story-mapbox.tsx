import { ThemeState, useLadleContext } from '@ladle/react';
import { useControls } from 'leva';
import Mapbox from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FC } from "react";
import Map from 'react-map-gl';
import { StoryMapProps } from '../story-map';
import { Canvas } from 'react-three-map';

/** `<Map>` styled for stories */
export const StoryMapbox: FC<StoryMapProps> = ({
  latitude, longitude, zoom = 18, pitch = 60, canvas, children
}) => {

  const { mapboxToken } = useControls({ mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '' })

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/streets-v12";

  Mapbox.accessToken = mapboxToken;

  return <div style={{ height: '100vh', position: 'relative' }}>
    {!mapboxToken && <>Add a mapbox token to load this component</>}
    {!!mapboxToken && <Map
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
      <Canvas latitude={latitude} longitude={longitude} {...canvas}>
        {children}
      </Canvas>
    </Map>}
  </div>
}