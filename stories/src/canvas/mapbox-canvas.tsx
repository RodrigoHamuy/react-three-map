import MapboxGl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useControls } from "leva";
import { ComponentProps, FC, PropsWithChildren } from "react";
import { Canvas } from "react-three-map";
import Map from 'react-map-gl';

export interface MapboxCanvasProps extends PropsWithChildren {
  map: ComponentProps<typeof Map>,
  canvas: ComponentProps<typeof Canvas>,
}

export const MapboxCanvas : FC<MapboxCanvasProps> = ({map, canvas, children}) => {

  const { mapboxToken } = useControls({
    mapboxToken: {
      value: import.meta.env.VITE_MAPBOX_TOKEN || '',
      label: 'mapbox token',
    }
  })
  MapboxGl.accessToken = mapboxToken;

  return <>
    {!mapboxToken && <Center>Add a mapbox token to load this component</Center>}
    {!!mapboxToken && <Map
      antialias
      initialViewState={{
        latitude: 51,
        longitude: 0,
        zoom: 13,
        pitch: 60,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      {...map}
    >
      {map.children}
      <Canvas {...canvas}>
        {children}
      </Canvas>
    </Map>}
  </>
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