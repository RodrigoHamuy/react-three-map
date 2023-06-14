import { ReconcilerRoot, RootState } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { MapInstance } from "react-map-gl";

export type StateRef = MutableRefObject<{
  map: MapInstance;
  root: ReconcilerRoot<HTMLCanvasElement>;
  state?: RootState;
} | undefined>