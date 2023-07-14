import { PropsWithChildren, memo } from "react";

export interface CoordinatesProps {
  children?: PropsWithChildren,
  longitude: number,
  latitude: number,
  altitude?: number,
}

export const Coordinates = memo<CoordinatesProps>(({children}) => {
  return <></>
})

Coordinates.displayName = 'Coordinates';