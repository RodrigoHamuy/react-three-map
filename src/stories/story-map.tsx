import { useControls } from 'leva';
import { FC, PropsWithChildren } from "react";
import { StoryMapbox } from './mapbox/story-mapbox';
import { StoryMaplibre } from './maplibre/story-maplibre';
import { CanvasProps } from '../maplibre/canvas';

export enum MapProvider {
  maplibre = "maplibre",
  mapbox = "mapbox",
}

export interface StoryMapProps extends PropsWithChildren {
  latitude: number,
  longitude: number,
  zoom?: number,
  pitch?: number,
  canvas?: Partial<CanvasProps>,
}

/** `<Map>` styled for stories */
export const StoryMap: FC<StoryMapProps> = ({
  latitude, longitude, zoom = 13, pitch = 60, children
}) => {

  const { mapProvider } = useControls({
    mapProvider: {
      value: MapProvider.maplibre,
      options: MapProvider,
    },
  });

  const props : StoryMapProps = { latitude, longitude, zoom, pitch, children};

  return <div style={{ height: '100vh', position: 'relative' }}>
    {mapProvider === MapProvider.maplibre && <StoryMaplibre {...props}>
      {children}
    </StoryMaplibre>}
    {mapProvider === MapProvider.mapbox && <StoryMapbox {...props}>
      {children}
    </StoryMapbox>}
  </div>
}