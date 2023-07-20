import { MapControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { FC, PropsWithChildren } from "react";
import { CanvasProps } from 'react-three-map';
import { StoryMapbox } from './mapbox/story-mapbox';
import { StoryMaplibre } from './maplibre/story-maplibre';

export enum MapProvider {
  maplibre = "maplibre",
  mapbox = "mapbox",
  nomap = "nomap",
}

export interface StoryMapProps extends PropsWithChildren {
  latitude: number,
  longitude: number,
  zoom?: number,
  pitch?: number,
  bearing?: number,
  canvas?: Partial<CanvasProps>,
}

/** `<Map>` styled for stories */
export const StoryMap: FC<StoryMapProps> = (props) => {

  const { mapProvider } = useControls({
    mapProvider: {
      value: MapProvider.maplibre,
      options: MapProvider,
      label: 'map provider'
    },
  });

  return <div style={{ height: '100vh', position: 'relative' }}>
    {mapProvider === MapProvider.maplibre && <StoryMaplibre {...props} />}
    {mapProvider === MapProvider.mapbox && <StoryMapbox {...props} />}
    {mapProvider === MapProvider.nomap && <Canvas 
    {...props.canvas} 
    camera={{position: [0,500,0]}}
    >
      <MapControls makeDefault />
      {props.children}
    </Canvas>}
  </div>
}