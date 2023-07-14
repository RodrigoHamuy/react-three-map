import { createContext, useMemo, useState } from "react";
import { CanvasProps } from "./canvas-props";
import { CanvasContext } from "./context";
import { coordsToMatrix } from "./coords-to-matrix";
import { FromLngLat } from "./generic-map";
import { useCreateRoot } from "./use-create-root";

export interface useCanvasProps extends CanvasProps {
  fromLngLat: FromLngLat,
}

export function useCanvas({
  longitude, latitude, altitude = 0,
  frameloop = 'always',
  fromLngLat,
  ...renderProps
}: useCanvasProps) {

  const [context] = useState(() => createContext<CanvasContext>({ fromLngLat }));

  const m4 = useMemo(() => coordsToMatrix({
    latitude, longitude, altitude, fromLngLat,
  }), [latitude, longitude, altitude]);

  const { id, onAdd, onRemove, render } = useCreateRoot({ m4, frameloop, context, ...renderProps });

  return { id, onAdd, onRemove, render }
}