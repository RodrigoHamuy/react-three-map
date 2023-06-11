import { MutableRefObject } from "react";
import { MapInstance } from "react-map-gl";
import { WebGLRenderer } from "three";

export type MapRendererRef = MutableRefObject<{
  renderer: WebGLRenderer;
  map: MapInstance;
} | undefined>