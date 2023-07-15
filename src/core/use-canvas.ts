import { CanvasProps } from "../api/canvas-props";
import { FromLngLat } from "./generic-map";
import { useCoords } from "./use-coords";
import { useCreateRoot } from "./use-create-root";
import { useRender } from "./use-render";

export interface useCanvasProps extends CanvasProps {
  fromLngLat: FromLngLat,
}

export function useCanvas({
  longitude, latitude, altitude = 0,
  frameloop = 'always',
  fromLngLat,
  ...renderProps
}: useCanvasProps) {

  const m4 = useCoords({
    latitude, longitude, altitude, fromLngLat,
  });
    
  const { id, onAdd, onRemove, stateRef } = useCreateRoot({ frameloop, fromLngLat, ...renderProps });
  
  const render = useRender(m4, stateRef, frameloop);

  return { id, onAdd, onRemove, render }
}