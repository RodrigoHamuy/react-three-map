import { memo } from "react";
import { FromLngLat, MapInstance } from "../generic-map";
import { useInitR3M } from "../use-r3m";
import { Coords } from "../coords";

interface InitR3MProps extends Coords {
  map: MapInstance,
  fromLngLat: FromLngLat,
}

/** Initialises the `R3M` hook */
export const InitR3M = memo<InitR3MProps>((props) => {
  useInitR3M(props);
  return <></>
})
InitR3M.displayName = 'InitR3M';