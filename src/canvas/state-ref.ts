import { ReconcilerRoot, RootState } from "@react-three/fiber";
import { Map } from "maplibre-gl";
import { MutableRefObject } from "react";

export type StateRef = MutableRefObject<{
  map: Map;
  root: ReconcilerRoot<HTMLCanvasElement>;
  state?: RootState;
} | undefined>