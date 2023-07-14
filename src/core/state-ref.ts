import { ReconcilerRoot, RootState } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { MapInstance } from "./generic-map";
import { Matrix4Tuple } from "three";

export type StateRef = MutableRefObject<{
  map: MapInstance;
  root: ReconcilerRoot<HTMLCanvasElement>;
  state?: RootState;
  mapCamMx?: Matrix4Tuple;
} | undefined>