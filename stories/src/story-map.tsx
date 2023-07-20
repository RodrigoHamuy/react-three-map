import { useControls } from 'leva';
import { FC, PropsWithChildren } from "react";
import { StoryMapbox } from './mapbox/story-mapbox';
import { StoryMaplibre } from './maplibre/story-maplibre';
import { CanvasProps } from 'react-three-map';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

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
      <OrbitControls makeDefault />
      {props.children}
    </Canvas>}
  </div>
}