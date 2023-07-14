import { useMemo } from "react";
import { coordsToMatrix } from "./coords-to-matrix";

type Props = Parameters<typeof coordsToMatrix>[0];

/** calculate matrix from coordinates */
export function useCoords({latitude, longitude, altitude, fromLngLat}: Props) {
  const m4 = useMemo(() => coordsToMatrix({
    latitude, longitude, altitude, fromLngLat,
  }), [latitude, longitude, altitude]);

  return m4;
}