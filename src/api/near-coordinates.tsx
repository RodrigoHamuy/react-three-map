import { memo, useMemo } from "react";
import { useCoords } from "../core/use-coords";
import { CoordinatesProps } from "./coordinates";
import { coordsToVector3 } from "./coords-to-vector-3";

export const NearCoordinates = memo<CoordinatesProps>(({children, ...coords})=>{
  const {latitude, longitude, altitude} = useCoords();
  const pos = useMemo(()=>coordsToVector3(coords, {latitude, longitude, altitude}), [ // eslint-disable-line react-hooks/exhaustive-deps
    latitude, longitude, altitude, coords.latitude, coords.longitude, coords.altitude
  ]);
  return <object3D position={pos}>{children}</object3D>
})
NearCoordinates.displayName = 'NearCoordinates';