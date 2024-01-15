import { ThemeState, useLadleContext } from '@ladle/react';
import { useControls } from 'leva';
import Mapbox from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FC, PropsWithChildren, memo, useId } from "react";
import Map, { Layer, Source } from 'react-map-gl';
import { Canvas } from 'react-three-map';
import { StoryMapProps } from '../story-map';

/** `<Map>` styled for stories */
export const StoryMapbox: FC<StoryMapProps> = ({
  latitude, longitude, canvas, children, ...rest
}) => {

  const { mapboxToken } = useControls({
    mapboxToken: {
      value: import.meta.env.VITE_MAPBOX_TOKEN || '',
      label: 'mapbox token',
    }
  })

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/streets-v12";

  Mapbox.accessToken = mapboxToken;

  const { showBuildings3D } = useControls({
    showBuildings3D: {
      value: true,
      label: 'show 3D buildings'
    }
  })

  return <div style={{ height: '100vh', position: 'relative' }}>
    {!mapboxToken && <Center>Add a mapbox token to load this component</Center>}
    {!!mapboxToken && <Map
      antialias
      initialViewState={{ latitude, longitude, ...rest }}
      maxPitch={rest.pitch ? Math.min(rest.pitch, 85) : undefined}
      mapStyle={mapStyle}
      mapboxAccessToken={mapboxToken}
    >
      <Canvas latitude={latitude} longitude={longitude} {...canvas}>
        {children}
      </Canvas>
      {showBuildings3D && <Buildings3D />}
    </Map>}
  </div>
}

const Center = ({ children }: PropsWithChildren) => (
  <div style={{
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }}>{children}</div>
)

const Buildings3D = memo(() => {
  const id = useId();
  return <Source id={id} type="vector" url="mapbox://mapbox.mapbox-streets-v8">
    <Layer
      id={id}
      type="fill-extrusion"
      source-layer="building"
      minzoom={15}
      filter={[
        "all",
        ["!=", ["get", "type"], "building:part"],
        ["==", ["get", "underground"], "false"],
      ]}
      paint={{
        "fill-extrusion-color": "#656565",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 1.0,
      }}
    />
  </Source>
})
Buildings3D.displayName = 'Buildings3D'