import { PropsWithChildren, memo, useContext } from "react";
import { canvasContext } from "../core/context";
import { useCoords } from "../core/use-coords";

export interface CoordinatesProps {
  children?: PropsWithChildren,
  longitude: number,
  latitude: number,
  altitude?: number,
}

export const Coordinates = memo<CoordinatesProps>(({
  latitude, longitude, altitude = 0, children
}) => {

  const {stateRef, fromLngLat} = useContext(canvasContext);

  const _m4 = useCoords({
    latitude, longitude, altitude, fromLngLat,
  });

  
  return <>
  </>
})

Coordinates.displayName = 'Coordinates';