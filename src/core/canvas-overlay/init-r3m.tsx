import { memo } from "react";
import { FromLngLat, MapInstance } from "../generic-map";
import { useInitR3M } from "../use-r3m";

interface InitR3MProps {
  map: MapInstance,
  fromLngLat: FromLngLat,
}

/** Initialises the `R3M` hook */
export const InitR3M = memo<InitR3MProps>(({ map, fromLngLat }) => {
  useInitR3M(map, fromLngLat);
  return <></>
})
InitR3M.displayName = 'InitR3M';