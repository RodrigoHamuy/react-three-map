import { memo, useMemo } from "react";
import { useR3M } from "../core/use-r3m";
import { coordsToVector3 } from "./coords-to-vector-3";
import { CoordinatesProps } from "./coordinates";

export const NearCoordinates = memo<CoordinatesProps>(({children, ...coords})=>{
  const {latitude, longitude, altitude} = useR3M();
  const pos = useMemo(()=>coordsToVector3(coords, {latitude, longitude, altitude}), [ // eslint-disable-line react-hooks/exhaustive-deps
    latitude, longitude, altitude, coords.latitude, coords.longitude, coords.altitude
  ]);
  return <object3D position={pos}>{children}</object3D>
})
NearCoordinates.displayName = 'NearCoordinates';